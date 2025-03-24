
// Mock study guide data
export const studyGuideData = {
  title: "Introduction to Cell Biology",
  content: [
    {
      section: "Cell Structure and Function",
      keyPoints: [
        "Cells are the fundamental units of life and the smallest structural and functional units of living organisms.",
        "The cell membrane (plasma membrane) is a selectively permeable barrier that separates the internal environment of the cell from the external environment.",
        "The cytoplasm is the gel-like substance inside the cell that contains various organelles and is where many cellular activities occur.",
        "The nucleus is the control center of the cell, containing genetic material (DNA) and directing cellular activities.",
        "Mitochondria are the powerhouses of the cell, producing energy (ATP) through cellular respiration."
      ],
      summary: "Cells are complex, microscopic units that form the basis of all living organisms. Each cell contains various specialized structures called organelles that perform specific functions essential for the cell's survival. Understanding cell structure provides insights into how organisms function at the most basic level."
    },
    {
      section: "Cell Membrane",
      keyPoints: [
        "The cell membrane consists of a phospholipid bilayer with embedded proteins and cholesterol molecules.",
        "The fluid mosaic model describes the structure of the cell membrane, with proteins floating in a fluid phospholipid bilayer.",
        "Membrane proteins serve various functions, including transport, cell recognition, enzymatic activity, and cell-to-cell communication.",
        "Transport across the membrane occurs through passive processes (diffusion, osmosis) or active processes that require energy.",
        "The cell membrane maintains homeostasis by controlling what enters and exits the cell."
      ],
      summary: "The cell membrane is a sophisticated barrier that regulates the movement of materials between the cell and its environment. Its selective permeability allows essential substances to enter while preventing harmful ones from passing through. This phospholipid bilayer with embedded proteins is crucial for cellular communication and maintaining internal balance."
    },
    {
      section: "Cell Cycle and Division",
      keyPoints: [
        "The cell cycle is the series of events that cells undergo as they grow and divide, consisting of interphase (G1, S, G2) and mitosis (M phase).",
        "Mitosis is the process of nuclear division, resulting in two identical nuclei.",
        "Cytokinesis is the division of the cytoplasm, completing cell division.",
        "Cell cycle checkpoints ensure that the cell is ready to proceed to the next phase, preventing errors in DNA replication or chromosome segregation.",
        "Regulation of the cell cycle is crucial, as uncontrolled cell division can lead to cancer."
      ],
      summary: "The cell cycle is the orderly sequence of events by which a cell duplicates its contents and divides into two. This process ensures that genetic information is accurately passed from one cell generation to the next. Proper regulation of the cell cycle is essential for normal growth, development, and tissue repair in multicellular organisms."
    },
    {
      section: "Cellular Respiration",
      keyPoints: [
        "Cellular respiration is the process by which cells convert glucose and oxygen into energy (ATP), carbon dioxide, and water.",
        "Glycolysis occurs in the cytoplasm and is the first stage of cellular respiration, breaking down glucose into pyruvate.",
        "The Krebs cycle (citric acid cycle) occurs in the mitochondria and generates NADH and FADH2, which carry electrons to the electron transport chain.",
        "The electron transport chain generates the majority of ATP through oxidative phosphorylation.",
        "Aerobic respiration (with oxygen) produces much more ATP than anaerobic respiration (without oxygen)."
      ],
      summary: "Cellular respiration is the biochemical process that extracts energy from nutrients, particularly glucose, to power cellular activities. This complex series of reactions transforms chemical energy stored in food molecules into ATP, the energy currency of cells. Efficient energy production is vital for all cellular functions, from protein synthesis to cell division."
    }
  ]
};

// Mock flashcard data
export const flashcardData = {
  title: "Cell Biology Flashcards",
  cards: [
    {
      id: 1,
      question: "What is the primary function of the cell membrane?",
      answer: "To regulate what enters and exits the cell, maintaining homeostasis through selective permeability."
    },
    {
      id: 2,
      question: "What are mitochondria often called, and why?",
      answer: "Mitochondria are called the 'powerhouses of the cell' because they generate most of the cell's supply of ATP (energy) through cellular respiration."
    },
    {
      id: 3,
      question: "What is the fluid mosaic model?",
      answer: "A model that describes the cell membrane as a fluid phospholipid bilayer with proteins floating within it, allowing for flexibility and selective permeability."
    },
    {
      id: 4,
      question: "What process do cells use to obtain energy from glucose?",
      answer: "Cellular respiration, which includes glycolysis, the Krebs cycle, and the electron transport chain."
    },
    {
      id: 5,
      question: "What are the main phases of the cell cycle?",
      answer: "Interphase (G1, S, G2) and M phase (mitosis and cytokinesis)."
    },
    {
      id: 6,
      question: "What is the function of DNA?",
      answer: "DNA contains the genetic instructions for the development, functioning, growth, and reproduction of all known organisms."
    },
    {
      id: 7,
      question: "What organelle is responsible for protein synthesis?",
      answer: "Ribosomes are responsible for protein synthesis in the cell."
    },
    {
      id: 8,
      question: "What is the difference between passive and active transport?",
      answer: "Passive transport doesn't require energy and moves substances from high to low concentration, while active transport requires energy and moves substances against their concentration gradient."
    }
  ]
};

// Mock quiz data
export const quizData = {
  title: "Cell Biology Quiz",
  questions: [
    {
      id: 1,
      question: "Which of the following is NOT a component of the cell membrane?",
      options: [
        "Phospholipids",
        "Proteins",
        "Cholesterol",
        "Ribosomes"
      ],
      correctAnswerIndex: 3
    },
    {
      id: 2,
      question: "What is the primary function of mitochondria?",
      options: [
        "Protein synthesis",
        "Energy production (ATP)",
        "Storage of nutrients",
        "Cell division"
      ],
      correctAnswerIndex: 1
    },
    {
      id: 3,
      question: "During which phase of the cell cycle does DNA replication occur?",
      options: [
        "G1 phase",
        "G2 phase",
        "S phase",
        "M phase"
      ],
      correctAnswerIndex: 2
    },
    {
      id: 4,
      question: "What process allows water to move across a selectively permeable membrane?",
      options: [
        "Active transport",
        "Facilitated diffusion",
        "Osmosis",
        "Endocytosis"
      ],
      correctAnswerIndex: 2
    },
    {
      id: 5,
      question: "What is the correct sequence of stages in cellular respiration?",
      options: [
        "Krebs cycle → Glycolysis → Electron transport chain",
        "Glycolysis → Electron transport chain → Krebs cycle",
        "Glycolysis → Krebs cycle → Electron transport chain",
        "Electron transport chain → Glycolysis → Krebs cycle"
      ],
      correctAnswerIndex: 2
    }
  ]
};

// Mock audio data
export const audioData = {
  title: "Cell Biology Audio Summary",
  audioUrl: "https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-0.mp3" // Using a sample audio URL
};
