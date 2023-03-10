import { KindleNotebook } from "@/types";

export const cosSim = (A: number[], B: number[]) => {
  let dotproduct = 0;
  let mA = 0;
  let mB = 0;

  for (let i = 0; i < A.length; i++) {
    dotproduct += A[i] * B[i];
    mA += A[i] * A[i];
    mB += B[i] * B[i];
  }

  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);

  const similarity = dotproduct / (mA * mB);

  return similarity;
};

const fixBrokenHTML = (sourceHTML: any) => {
  let fixedHTML = sourceHTML.replace(/(\r\n|\n|\r)/gm, "");
  fixedHTML = fixedHTML.replace("</div></div></h1><hr/>", "</div></h1><hr/>");

  if (!fixedHTML.includes("</h3>")) {
    return fixedHTML;
  }

  return fixedHTML.replaceAll("</h3>", "</div>").replaceAll("</div><div class='noteText'>", "</h3><div class='noteText'>");
};

const highlightType = (text: any) => {
  const match = text.match(/^(.*)\s-\s/);
  if (match) {
    return match[1];
  }
};

const extractPageNumber = (text: any) => {
  const match = text.match(/\s-\s\w*\s+([0-9]+)/);
  if (match) {
    return match[1];
  }
};

const extractLocation = (text: any) => {
  const match = text.match(/\s·\s\w*\s+([0-9]+)/);
  if (match) {
    return match[1];
  }
};

const cleanUpText = (text: any) => {
  let newText = text;

  [",", ".", ";", "(", ")", "“"].forEach((mark) => {
    newText = newText.replaceAll(` ${mark}`, mark);
  });

  return newText;
};

export const parseHighlights = (rawHTML: any) => {
  const fixedHTML = fixBrokenHTML(rawHTML);

  const domparser = new DOMParser();
  const doc = domparser.parseFromString(fixedHTML, "text/html");

  const container = doc.querySelector(".bodyContainer");
  const bookTitle: any = doc.querySelector(".bookTitle");
  const bookAuthors: any = doc.querySelector(".authors");

  if (container) {
    const nodes = Array.from(container.children);

    const sections = [];
    let currentSection: any = null;
    let currentHighlight: any = null;

    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return;
      }

      if (node.className === "sectionHeading") {
        if (currentSection !== null) {
          sections.push({ ...currentSection });
        }

        currentSection = {
          sectionTitle: node.innerHTML.trim(),
          highlights: []
        };
      }

      if (node.className === "noteHeading") {
        const heading = node.innerHTML.trim();

        currentHighlight = {
          type: highlightType(heading),
          page: extractPageNumber(heading),
          location: extractLocation(heading),
          highlight: ""
        };
      }

      if (node.className === "noteText") {
        if (!currentHighlight) return;

        currentHighlight.highlight = cleanUpText(node.innerHTML.trim());

        if (currentHighlight !== null) {
          currentSection.highlights.push({ ...currentHighlight });
        }
      }
    });

    if (currentSection !== null) {
      sections.push({ ...currentSection });
    }

    const notebook: KindleNotebook = {
      title: bookTitle.innerHTML.trim().replace(/&amp;/g, "&"),
      author: bookAuthors.innerHTML.trim(),
      highlights: sections,
      embeddings: []
    };

    return notebook;
  }
};
