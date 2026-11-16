const CATEGORY_NAMES = ["Teaching and Learning", "Literacy and Language", "STEM and Problem Solving", "Educational Leadership and Professional Learning", "Guidance, Behavior and Well-being", "Inclusive Education", "Family, Community and Learner Participation", "Office and Service Management", "Financial Literacy", "DRRM and School Safety", "Environmental Education and Sustainability", "Research, Planning and Evaluation", "Digital Education"];
function modelCategories(model) { return model.categories?.length ? model.categories : [model.category]; }
function flattenForSearch(value) {
 if(Array.isArray(value)) return value.map(flattenForSearch).join(' ');
 if(value && typeof value === 'object') return Object.values(value).map(flattenForSearch).join(' ');
 return value == null ? '' : String(value);
}
function normalizeSearch(value) {
 return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
 .replace(/([a-z])[’']s\b/g,'$1').replace(/\b(?:[a-z]\.){2,}/g,s=>s.replace(/\./g,''))
 .replace(/[^a-z0-9]+/g,' ').trim();
}
const QUERY_EQUIVALENTS = {behaviour:'behavior',behavioural:'behavior',behavioral:'behavior',counselling:'counseling',organisation:'organization',organisational:'organizational',frameworks:'framework',models:'model',teachers:'teacher',learners:'learner',students:'student'};
function queryWords(q) { return normalizeSearch(q).split(/\s+/).filter(Boolean).map(w=>QUERY_EQUIVALENTS[w]||w); }
function searchText(m) {
 const text=normalizeSearch([m.modelName,...modelCategories(m),m.learningArea,m.summary,...(m.tags||[]),...(m.searchTerms||[]),flattenForSearch(m.sections)].join(' '));
 return text+' '+text.split(' ').map(w=>QUERY_EQUIVALENTS[w]||w).join(' ');
}
const MODEL_SEARCH_INDEX = new Map(MODELS.map(m=>[m.id,searchText(m)]));
function findModels(query,category='') {
 const words=queryWords(query),phrase=normalizeSearch(query);
 return MODELS.filter(m=>(!category||modelCategories(m).includes(category))&&words.every(w=>MODEL_SEARCH_INDEX.get(m.id).includes(w)))
 .map((m,i)=>({m,i,score:!phrase?0:(normalizeSearch(m.modelName).includes(phrase)?100:0)+(normalizeSearch((m.searchTerms||[]).join(' ')).includes(phrase)?30:0)}))
 .sort((a,b)=>b.score-a.score||a.i-b.i).map(x=>x.m);
}
