export const POLICY = {
  title: 'Lumbar MRI', id: 'L34220', effective: 'October 23, 2025',
  url: 'https://www.cms.gov/medicare-coverage-database/view/lcd.aspx?LCDId=34220',
  appealsUrl: 'https://www.cms.gov/medicare/appeals-grievances/fee-for-service/first-level-appeal-redetermination-medicare-contractor',
  scope: 'Original Medicare · Noridian JE · California',
};

export const CASE = {
  id: 'DEMO-1042', patient: 'Margaret Ellis', member: 'DEMO-MEMBER-1042',
  hospital: 'Alder Bay Hospital', reviewer: 'Jamie Chen',
  service: 'Outpatient lumbar MRI', serviceDate: '2026-10-14', denialDate: '2026-11-03',
  billedAmount: 1240, denial: 'Medical necessity not established',
};

export const DOCUMENTS = [
  { id: 'denial', title: 'Denial summary', kind: 'Claim correspondence', date: '2026-11-03', pages: 1, author: 'Synthetic payer correspondence',
    sections: [
      { id: 'decision', title: 'Determination', text: 'Demo claim DEMO-1042 for Margaret Ellis, service date October 14, 2026: outpatient lumbar MRI. Billed amount: $1,240.00. The claim was denied because the submitted documentation did not establish medical necessity.' },
      { id: 'reason', title: 'Reason for denial', text: 'The materials submitted did not demonstrate the prior course of conservative treatment or explain how the imaging findings would inform a treatment decision. This is a fictional summary for a first-appeal example, not an official payer notice.' },
      { id: 'context', title: 'Appeal context', text: 'The demonstration assumes an adjudicated medical-necessity denial under Original Medicare, Noridian Jurisdiction E. Receipt date and actual filing instructions have not been established. This synthetic package is not for submission.' },
    ] },
  { id: 'order', title: 'Imaging order', kind: 'Ordering clinician', date: '2026-10-08', pages: 1, author: 'Dr. Lena Ortiz · fictional clinician',
    sections: [
      { id: 'order', title: 'Order', text: 'Patient: Margaret Ellis. Order: lumbar spine MRI. Ordering clinician: Dr. Lena Ortiz. Ordered and signed October 8, 2026. Requested study date: October 14, 2026.' },
      { id: 'indication', title: 'Clinical indication', text: 'Persistent lumbar pain with right-sided radiating leg symptoms despite a course of conservative management. Imaging requested to inform evaluation of interventional treatment options. See the October 8 clinical assessment and prior-treatment record for supporting context.' },
    ] },
  { id: 'clinical', title: 'Clinical assessment', kind: 'Clinical record', date: '2026-10-08', pages: 1, author: 'Dr. Lena Ortiz · fictional clinician',
    sections: [
      { id: 'symptoms', title: 'History and findings', text: 'Margaret Ellis reports persistent lower-back pain with right-sided radiating leg symptoms. Symptoms continue to interfere with walking and daily activities. The clinician documented persistent symptoms at reassessment on October 8, 2026.' },
      { id: 'plan', title: 'Assessment and plan', text: 'Given ongoing symptoms after conservative management, lumbar MRI is requested to assess findings that may inform targeted interventional treatment. An interventional consultation is under consideration; the choice of treatment will depend on the imaging findings and clinical reassessment.' },
      { id: 'limits', title: 'Record note', text: 'This is a synthetic, abbreviated clinical record created to demonstrate evidence review. It is not a medical recommendation, complete chart, or assertion that coverage criteria are satisfied.' },
    ] },
  { id: 'treatment', title: 'Conservative treatment record', kind: 'Treatment history', date: '2026-10-07', pages: 1, author: 'Alder Bay outpatient team · fictional',
    sections: [
      { id: 'course', title: 'Treatment course', text: 'Margaret Ellis completed a documented course of conservative management from August 31 through October 7, 2026, including supervised physical therapy, a home exercise program, and clinician-directed symptom management.' },
      { id: 'response', title: 'Response to treatment', text: 'At completion of the course, the record describes persistent pain and functional limitations without meaningful improvement. Reassessment with the ordering clinician was scheduled for October 8, 2026.' },
    ] },
  { id: 'imaging', title: 'Imaging report', kind: 'Completed service', date: '2026-10-14', pages: 1, author: 'Alder Bay radiology · fictional',
    sections: [
      { id: 'service', title: 'Service performed', text: 'Lumbar MRI performed for Margaret Ellis on October 14, 2026, corresponding to the October 8 order. This synthetic report records completion of the service only.' },
      { id: 'scope', title: 'Scope of this example', text: 'Image findings are deliberately omitted from this demo. The evidence review focuses on records documenting the clinical rationale before the examination; a completed scan alone does not establish that payment is warranted.' },
    ] },
];

export const EVIDENCE = [
  { id: 'order', title: 'A signed imaging order', summary: 'The treating clinician ordered the lumbar MRI before the service.', document: 'order', section: 'order', policySummary: 'The policy describes an order from the treating clinician, properly signed and dated.' },
  { id: 'rationale', title: 'Clinical rationale', summary: 'Persistent symptoms and functional limitations are documented.', document: 'clinical', section: 'symptoms', policySummary: 'The policy expects clinical information supporting the need for the examination.' },
  { id: 'treatment', title: 'Prior treatment and response', summary: 'The course of conservative management and the response are documented.', document: 'treatment', section: 'course', policySummary: 'Relevant prior treatment belongs in the supporting clinical record; its significance depends on the case.' },
  { id: 'decision', title: 'How imaging informs treatment', summary: 'The clinical plan connects imaging to a contemplated treatment decision.', document: 'clinical', section: 'plan', policySummary: 'The policy considers how imaging will inform diagnosis or treatment.' },
];

export const ASSUMPTIONS = [
  'Preparing an evidence-supported appeal consumes meaningful staff time.',
  'The necessary records exist and the appeals specialist can access them.',
  'Showing each assertion beside its source helps a reviewer assess the draft.',
  'Document import and export are enough to evaluate the workflow before integrations.',
  'This denial category has sufficient volume and value to justify a dedicated tool.',
];
