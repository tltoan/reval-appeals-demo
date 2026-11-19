import { CASE, DOCUMENTS, EVIDENCE, POLICY } from './data.js';

export function initialState(scenario = 'missing') {
  return { version: 1, scenario, step: 'overview', fields: { ...CASE },
    documents: DOCUMENTS.filter(d => scenario === 'complete' || d.id !== 'treatment').map(d => d.id),
    reviewed: [], draft: null, edited: [], verified: [], approved: false, exported: false,
    selectedDocument: 'denial', selectedEvidence: 'order', selectedParagraph: 'opening' };
}
export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
export const documentById = id => DOCUMENTS.find(d => d.id === id);
export const evidenceStatus = state => EVIDENCE.map(e => ({ ...e, found: state.documents.includes(e.document), reviewed: state.reviewed.includes(e.id) && state.documents.includes(e.document) }));
export function draftParagraphs(state) {
  const f = state.fields;
  return [
    { id: 'opening', label: 'Request for review', text: `We request a first-level redetermination of claim ${f.id} for ${f.patient}, concerning an outpatient lumbar MRI performed on ${f.serviceDate}. The denial dated ${f.denialDate} states that medical necessity was not established. We ask that the enclosed records be considered in reviewing the determination.`, sources: [{ document:'denial', section:'decision' }] },
    { id: 'clinical', label: 'Clinical rationale', text: 'The October 8 clinical assessment documents persistent lower-back pain with right-sided radiating leg symptoms and functional limitations. Dr. Lena Ortiz signed the imaging order on October 8, before the examination.', sources:[{document:'clinical',section:'symptoms'}, {document:'order',section:'order'}] },
    { id: 'treatment', label: 'Prior treatment', text: state.documents.includes('treatment') ? 'The treatment record describes conservative management from August 31 through October 7, including supervised physical therapy, a home exercise program, and clinician-directed symptom management. It records persistent pain and functional limitations without meaningful improvement at completion.' : '[Evidence missing: add and review the conservative treatment record before completing this paragraph.]', sources: state.documents.includes('treatment') ? [{document:'treatment',section:'course'},{document:'treatment',section:'response'}] : [] },
    { id: 'decision', label: 'Purpose of imaging', text:'The ordering clinician documented that the MRI was intended to inform evaluation of targeted interventional treatment, with an interventional consultation under consideration. We submit this pre-examination rationale for review alongside the documented prior treatment.', sources:[{document:'clinical',section:'plan'},{document:'order',section:'indication'}] },
    { id: 'closing', label: 'Supporting materials', text:'Please review the enclosed order, clinical assessment, treatment record, and confirmation of the completed examination in connection with this appeal. These materials are offered for reconsideration; they do not themselves establish a right to payment.', sources:[{document:'imaging',section:'service'}] },
  ];
}
export function generateDraft(state) {
  state.draft = draftParagraphs(state); state.edited = []; state.verified = []; state.approved = false; state.exported = false;
}
export function addTreatment(state) {
  if (!state.documents.includes('treatment')) state.documents.push('treatment');
  state.approved = false; state.exported = false;
  // Preserve the user's wording. Only replace the untouched missing-evidence placeholder.
  if (state.draft) {
    const replacement = draftParagraphs(state).find(p => p.id === 'treatment');
    state.draft = state.draft.map(p => p.id === 'treatment' ? (state.edited.includes('treatment') ? { ...p, sources: replacement.sources } : replacement) : p);
    state.verified = state.verified.filter(id => id !== 'treatment');
  }
}
export function updateParagraph(state, id, text) {
  const p = state.draft?.find(p => p.id === id); if (!p) return;
  p.text = text;
  if (!state.edited.includes(id)) state.edited.push(id);
  state.verified = state.verified.filter(v => v !== id);
  state.approved = false; state.exported = false;
}
export function readiness(state) {
  const evidence = evidenceStatus(state);
  const checks = [
    { id:'details', label:'Case details match the records', complete:['patient','id','serviceDate','denialDate'].every(k => state.fields[k] === CASE[k]) },
    { id:'documents', label:'Supporting records present', complete:evidence.every(e => e.found) },
    { id:'evidence', label:'Evidence reviewed', complete:evidence.every(e => e.reviewed) },
    { id:'draft', label:'Appeal draft prepared', complete:!!state.draft && state.draft.every(p => p.text.trim().length >= 20 && !p.text.includes('[Evidence missing:')) },
    { id:'edits', label:'Edited statements checked', complete:state.edited.every(id => state.verified.includes(id)) },
    { id:'approval', label:'Final review confirmed', complete:state.approved },
  ];
  return { checks, ready: checks.every(c => c.complete) };
}
export function packageHtml(state) {
  if (!readiness(state).ready) throw new Error('Complete the evidence and final review before exporting.');
  const e = escapeHtml, f = state.fields;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Reval demo appeal — ${e(f.id)}</title><style>body{font:16px/1.6 system-ui,sans-serif;color:#172b2c;max-width:850px;margin:48px auto;padding:0 24px}h1{font-size:28px}h2{font-size:22px;margin-top:36px}h3{font-size:16px}p{white-space:pre-wrap}aside{background:#f3f5f5;padding:16px;border-left:3px solid #526f70}small{color:#526268}a{color:#1b6c80}section.record{break-before:page;border-top:1px solid #ddd;margin-top:40px}button{padding:10px 16px;cursor:pointer} @media print{button{display:none}body{margin:0;max-width:none}aside{background:none}}</style></head><body><button onclick="window.print()">Print / save as PDF</button><h1>Reval · Appeal review package</h1><aside><strong>Fictional demonstration — not for submission.</strong><br>All case details and clinical records are synthetic. The draft is a simulated product output. No claim has been submitted and no payment or coverage determination has been made. Receipt date, filing deadline, and actual submission details remain unverified.</aside><h2>First-level redetermination draft</h2><p>Patient: ${e(f.patient)}<br>Demo member: ${e(f.member)}<br>Claim: ${e(f.id)}<br>Service: ${e(f.service)}<br>Service date: ${e(f.serviceDate)}<br>Denial date: ${e(f.denialDate)}<br>Provider: ${e(f.hospital)}</p>${state.draft.map(p=>`<p>${e(p.text)}</p><small>Source references: ${p.sources.map(s=>`${e(documentById(s.document)?.title || s.document)} — ${e(documentById(s.document)?.sections.find(x=>x.id===s.section)?.title || s.section)}`).join('; ')}${state.edited.includes(p.id)?' · Manually edited; checked by demo reviewer':''}</small>`).join('')}<h2>Attachment index</h2><ol>${DOCUMENTS.filter(d=>state.documents.includes(d.id)).map(d=>`<li><a href="#doc-${e(d.id)}">${e(d.title)}</a> · ${e(d.date)}</li>`).join('')}</ol><h2>Policy references</h2><p><a href="${POLICY.url}">${POLICY.id}: ${POLICY.title}</a> · Version effective ${POLICY.effective}.<br><a href="${POLICY.appealsUrl}">CMS first-level redetermination guidance</a></p><p>The evidence topics in this prototype are selected review prompts, not a comprehensive coverage checklist.</p>${DOCUMENTS.filter(d=>state.documents.includes(d.id)).map(d=>`<section class="record" id="doc-${e(d.id)}"><small>Synthetic supporting record · ${e(f.id)}</small><h2>${e(d.title)}</h2><p>${e(d.author)}<br>${e(d.date)}</p>${d.sections.map(s=>`<h3>${e(s.title)}</h3><p>${e(s.text)}</p>`).join('')}</section>`).join('')}</body></html>`;
}
