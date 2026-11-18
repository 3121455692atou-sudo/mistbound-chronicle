/** Explanation only. Eligibility and thresholds come exclusively from the engine. */
export function mentorGuidanceHtml(g,esc) {
 const status=g.level>=g.maxLevel?'常备军已到最高等级。':!g.members.length?'当前没有可用的指导角色。先获得可用角色，再查看指导上限。':g.missingTotal===0?'当前角色等级已满足下一级指导条件；仍需查看指令与费用。':`按当前 ${g.members.length} 名指导角色，下一级 Lv ${g.nextLevel} 需要合计等级 ${g.requiredTotal}，当前 ${g.total}，还差 ${g.missingTotal}。`;
 return `<p>${status}</p>${g.mentorCap<g.level?'<p>角色变化后，已经训练的等级保留。</p>':''}<ul>${g.members.map(m=>`<li><button class="small-button secondary" data-mentor="${esc(m.id)}">${esc(m.name)} · Lv ${m.level} · ${m.level>=g.maxLevel?'已满级':`升级还需 ${m.expRemaining} 经验`}</button></li>`).join('')}</ul><p>这里只显示当前可用的最高六名角色。点击查看成长；特训需有可用额度、干劲、指令与金币。实战也能获得经验，模拟战不增加本局经验。角色 Lv 提高可提高指导上限；常备军仍需另行付费训练。角色变化后重新查看，不保证几次特训就能升级。</p>`;
}
export function bindMentorGuidance(host,{live,open}) {
 let used=false;
 host.querySelectorAll('[data-mentor]').forEach(button=>button.onclick=event=>{
  if(used||event?.detail>1||button.disabled||!live())return;
  used=true;open(button.dataset.mentor);
 });
}
