export const favorites = {
  key: 'iara:favorites',
  list(){ 
    try { 
      return JSON.parse(localStorage.getItem(this.key)) || []; 
    } catch { 
      return []; 
    }
  },
  save(arr){ localStorage.setItem(this.key, JSON.stringify(arr)); },
  has(slug){ return this.list().includes(slug); },
  toggle(slug){
    const cur = this.list();
    const i = cur.indexOf(slug);
    if(i >= 0) cur.splice(i,1);
    else cur.push(slug);
    this.save(cur);
  }
};
