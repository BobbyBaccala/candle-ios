# Editorial review protocol

This is a release checklist, not evidence that an independent reviewer has signed off. The bank was reviewed during implementation; external educator review and learner validation remain outstanding.

## Writing a set

1. Define an observable objective: a decision the learner can improve, not merely a term to recognize. Use a practical context without assuming a salary, spare savings or access to investments.
2. Split the concept into distinct facets. Do not ask the same inference with changed names, numbers or wording in one set. A different response widget is not a different reasoning task.
3. Write three distinct tasks: make a choice under constraints; diagnose a claim; reason about evidence, tradeoffs or transfer. All may use choice buttons.
4. State assumptions determining the best answer. Avoid categorical recommendations where goals, liquidity, risk capacity, jurisdiction or contract terms can reverse it. No lesson should require arithmetic or a calculator.
5. Draft the explanation before distractors. State the mechanism, relevant condition and why an appealing misconception fails. The question must be understandable without opening the learning goal or source.
6. Use plausible distractors. Check for a second defensible answer, grammar/length clues, joke options and rote “always/never” shortcuts. Beginner items still include explicit guarantee myths; a pilot should test whether these distractors are too easy.
7. Add credible source IDs and review relevant sections. Distinguish theory, empirical evidence, guidance and original educational inference. A paper on education outcomes does not validate an individual question.
8. Add two qualitative hints that do not request a formula or calculator. Limit reading burden and avoid shaming people for constrained resources or mistakes.

## Reviewing a set

- Answer without seeing the key. Explain why each alternative fails under the assumptions. Resolve disagreement with a finance educator; do not fix ambiguity by changing only the key.
- Compare every pair for the underlying inference as well as wording. Check facet and format labels are truthful. Automation cannot detect every paraphrase or mislabeled concept.
- Inspect boundaries: fixed/variable rates, nominal/real values, price/total return, gross/net results, profit/cash, liquidity/net worth, expectation/realization, ownership/creditor claims and willingness/ability to bear risk.
- Remove promised profits, prescriptive stock picks and unsupported causality. Describing an indicator is not evidence of predictive skill. Include costs, selection and uncertainty where relevant.
- Verify destinations, currency of rules and commercial reuse permissions. Link to sources; do not copy their exercises, figures or proprietary assessment items.
- Run `node scripts/validate-curriculum.cjs` and `node --test tests/*.test.cjs`. Include negative tests for new quality rules. Passing is required but is not academic approval.
- Preview on a narrow mobile screen, with keyboard navigation, zoom and a screen reader. Test long options, hints, feedback, missed-question review and disclosures. Recheck saved progress when changing slot metadata.

## Extending and validating

The slot mapping is a compatibility contract. Adding, removing or reordering stages needs an explicit progress/server-ID migration; the installer refuses a changed slot count. Do not clear earned progress to make tests pass. Bump `curriculumVersion` for substantive revisions and preserve score provenance.

Collect learner feedback with consent. Look for misunderstood wording, unused distractors, stylistic answer clues, frustration and accidental taps. Evaluate delayed retention and application to new scenarios, not only repeated-item accuracy or XP. Separate participation statistics from financial competence. Do not label content “Wharton approved,” “research validated” or equivalent without the corresponding review or study.
