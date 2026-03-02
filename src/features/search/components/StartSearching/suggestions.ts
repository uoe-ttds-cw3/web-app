const CATEGORY_SUGGESTIONS: Record<string, string[]> = {
  anesthesiology: ["anesthesia machine", "ventilator"],
  cardiovascular: ["pacemaker", "stent", "cardiac monitor"],
  chemistry: ["clinical chemistry analyzer", "blood glucose meter"],
  dental: ["dental handpiece"],
  ent: ["hearing aid", "otoscope"],
  gastro_urology: ["endoscope", "ureteral stent", "PVC urinary catheter"],
  surgery: ["surgical instrument", "surgical mesh"],
  hospital: ["hospital bed", "wheelchair"],
  hematology: ["hematology analyzer"],
  immunology: ["PCR instrument", "rapid diagnostic test kit"],
  microbiology: ["culture medium"],
  neurology: ["EEG machine", "nerve stimulator"],
  obgyn: ["fetal monitor"],
  ophthalmic: ["slit lamp"],
  orthopedic: ["joint prosthesis", "spinal fixation device"],
  pathology: ["tissue processor"],
  physical_medicine: ["ultrasound therapy device"],
  radiology: ["X-ray machine", "MRI machine"],
};

const SUGGESTION_POOL = Object.values(CATEGORY_SUGGESTIONS).flat();
const SUGGESTION_COUNT = 8;

export function pickRandomSuggestions() {
  const shuffled = [...SUGGESTION_POOL];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, SUGGESTION_COUNT);
}
