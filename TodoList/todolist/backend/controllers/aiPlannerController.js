const Plan = require("../models/Plan");

const TOPICS = {
  DSA: ["Arrays & Strings", "Linked Lists", "Trees", "Graphs", "DP", "Sorting", "Hashing", "Greedy"],
  OS: ["Process Scheduling", "Deadlock", "Memory Mgmt", "Paging", "Synchronization"],
  DBMS: ["Normalization", "SQL", "Transactions", "Indexing", "ER Model", "Joins"],
  CN: ["OSI Model", "TCP/IP", "Routing", "Subnetting", "Congestion"],
  Aptitude: ["Percentages", "Time & Work", "Probability", "Permutations", "Ratios"],
  Reasoning: ["Series", "Coding-Decoding", "Blood Relations", "Syllogism"],
  Maths: ["Calculus", "Linear Algebra", "Probability"],
  English: ["Vocabulary", "Grammar", "Comprehension"],
  Physics: ["Mechanics", "Optics", "Thermodynamics"],
  Chemistry: ["Organic", "Inorganic"],
  "Current Affairs": ["National", "International", "Sports"],
  "General Studies": ["History", "Polity", "Geography", "Economy"],
};

const COLORS = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#f43f5e", "#14b8a6"];

exports.generate = async (req, res, next) => {
  try {
    const { subjects = [], hoursPerDay = 4, days = 7 } = req.body;
    if (!subjects.length) return res.status(400).json({ message: "Select at least one subject" });

    const created = [];
    const counters = {};
    const perBlock = hoursPerDay / Math.min(subjects.length, 2);

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      const todays = [subjects[i % subjects.length]];
      if (subjects.length > 1) todays.push(subjects[(i + 1) % subjects.length]);

      for (const subj of todays) {
        const bank = TOPICS[subj] || ["General Revision"];
        counters[subj] = (counters[subj] || 0);
        const topic = bank[counters[subj] % bank.length];
        counters[subj]++;

        const plan = await Plan.create({
          user: req.user._id,
          subject: subj,
          topic,
          date: dateStr,
          hours: parseFloat(perBlock.toFixed(1)),
          color: COLORS[created.length % COLORS.length],
        });
        created.push(plan);
      }
    }

    res.status(201).json({ message: `Generated ${days}-day plan with ${created.length} sessions`, plans: created });
  } catch (err) {
    next(err);
  }
};
