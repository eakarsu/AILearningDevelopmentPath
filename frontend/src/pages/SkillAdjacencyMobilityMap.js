import React, { useEffect, useState } from 'react';
export default function SkillAdjacencyMobilityMap() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch('/api/skill-adjacency-mobility-map').then(r => r.json()).then(setData).catch(() => {}); }, []);
  return <div><h1>Skill Adjacency Mobility Map</h1><p>Maps employees from current roles to adjacent target roles and next learning actions.</p>{data?.employees?.map(e => <section className="card" key={e.name}><h2>{e.name}</h2><p>{e.current_role} to {e.target_role}: {e.readiness}; next {e.next_learning}</p></section>)}</div>;
}
