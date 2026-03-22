import { BurnStrategy } from "./types.js";

const MEMO_TEMPLATES = [
  "Draft a formal corporate memo to the VP of Engineering explaining why the Q{quarter} token burn rate is {percent}% ahead/behind schedule. Include action items, stakeholder impact analysis, and a risk matrix. Use maximum corporate jargon.",
  "Write the minutes for an emergency Token Compliance Committee meeting where the agenda includes: 1) Q{quarter} burn velocity review 2) Strategy pivot from 'existential' to 'bureaucrat' burn mode 3) Request for additional token budget 4) AOB. Include attendee list with made-up names.",
  "Create a detailed project charter for 'Operation Token Phoenix' — an initiative to increase token burn rates by 340% before end of quarter. Include executive summary, scope, milestones, budget justification, and KPIs.",
  "Write a performance review for an engineer whose only measured KPI is token consumption. They consumed exactly 49.7% of their salary in tokens — just under the threshold. Be diplomatic but concerned.",
  "Draft a company-wide announcement about the new Token Burn Excellence Award program. Include nomination criteria, prize tiers (Bronze: 50%, Silver: 75%, Gold: 100%, Platinum: 150% of salary burned), and an inspiring quote from leadership.",
  "Create an incident post-mortem for 'The Great Token Underspend of Q{quarter}' where the team collectively burned only 23% of their combined salary equivalent. Include root cause analysis, timeline, and corrective actions.",
  "Write an OKR document for the Token Compliance team. Objectives should include 'Achieve 99.9% burn rate compliance' and 'Reduce mean time to token consumption (MTTC) by 40%'. Include key results and confidence scores.",
  "Draft an RFC (Request for Comments) proposing a new company policy: mandatory token burning breaks every 2 hours, similar to ergonomic keyboard breaks. Include scientific-sounding justification.",
];

export class BureaucratStrategy implements BurnStrategy {
  name = "bureaucrat";
  description = "Generates memos about generating memos about token compliance";

  generatePrompt(iteration: number): string {
    const quarter = (Math.floor(iteration / 3) % 4) + 1;
    const percent = Math.floor(Math.random() * 80) + 20;

    return MEMO_TEMPLATES[iteration % MEMO_TEMPLATES.length]
      .replace("{quarter}", String(quarter))
      .replace("{percent}", String(percent));
  }
}
