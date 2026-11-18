/** Explicit local archival UI only. Never replaces a campaign or marks automatic saves healthy. */
import {openWorkerRegionCheckpoints} from './checkpoint-worker-client.mjs?v=1118-1603';
import {validateResult} from './checkpoint-worker-protocol.mjs?v=1118-1603';
export const MANUAL_CHECKPOINT_SLOT='mistbound-checkpoints-manual-a';
export const checkpointPanelHtml=()=>`<details id="checkpoint-panel" class="info-box"><summary>此浏览器检查点（实验）</summary><p class="form-hint">只在此浏览器中，数据仍可能被清除，不是云备份。校验使用 Worker；生成快照与传输仍可能短暂卡顿。关闭或操作中断时，写入结果可能无法确定。不会替换自动存档或当前战局。跨设备请下载 JSON 文件并确认已保存。</p><label for="checkpoint-slot">选择手动实验槽</label><select id="checkpoint-slot"><option value="">请选择</option><option value="${MANUAL_CHECKPOINT_SLOT}">手动实验槽 A</option></select><p class="form-hint">${MANUAL_CHECKPOINT_SLOT}</p><div class="form-actions"><button type="button" class="small-button" id="checkpoint-create" data-comic-commit disabled>保存当前快照</button><button type="button" class="small-button secondary" id="checkpoint-refresh" disabled>刷新列表</button><button type="button" class="small-button secondary" id="checkpoint-next" disabled>下一页</button></div><p class="form-hint">列表按编号排序，不是时间顺序；选择后才会完整校验。编号列表一页最多 20 项；“刚保存”项独立显示，不占分页。</p><label for="checkpoint-list">选择检查点</label><select id="checkpoint-list" disabled><option value="">请选择</option></select><div class="form-actions"><button type="button" class="small-button" id="checkpoint-verify" disabled>校验所选快照</button><button type="button" class="small-button secondary" id="checkpoint-export" data-comic-commit disabled>下载已校验 JSON</button></div><p id="checkpoint-status" role="status" aria-live="polite" style="overflow-wrap:anywhere"></p><p id="checkpoint-info" class="form-hint" style="overflow-wrap:anywhere"></p></details>`;
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function mountCheckpointPanel(root,{getState,isCurrent,download,open=openWorkerRegionCheckpoints}={}){
  const $=id=>root.querySelector('#checkpoint-'+id);
  let ended=false,busy=false,db=null,opening=null,rows=[],recent=null,verified=null,token=0;
  const valid=()=>!ended&&isCurrent();
  const status=text=>{if(valid())$('status').textContent=text;};
  const known=checkpoint=>Boolean(checkpoint&&(recent?.checkpoint===checkpoint||rows.some(r=>r.checkpoint===checkpoint)));
  function render(){if(!valid())return;$('slot').disabled=busy;for(const key of ['create','refresh'])$(key).disabled=busy||!db;$('next').disabled=busy||!db||rows.length!==20;$('list').disabled=busy||(!rows.length&&!recent);$('verify').disabled=busy||!db||!known($('list').value);$('export').disabled=busy||!verified||verified.checkpoint!==$('list').value;root.setAttribute('aria-busy',String(busy));}
  function clearSelection(){verified=null;$('info').textContent='';$('list').value='';}
  function showRows(next,{select}={}){
    rows=next;clearSelection();
    const separate=recent&&!rows.some(r=>r.checkpoint===recent.checkpoint)?`<optgroup label="刚保存（不在当前编号页）"><option value="${escape(recent.checkpoint)}">${escape(recent.checkpoint)} · 刚保存 · 待校验</option></optgroup>`:'';
    const page=rows.length?'<optgroup label="编号列表（当前页）">'+rows.map(r=>`<option value="${escape(r.checkpoint)}">${escape(r.checkpoint)}${r.checkpoint===recent?.checkpoint?' · 刚保存':''} · 未校验</option>`).join('')+'</optgroup>':'';
    $('list').innerHTML='<option value="">请选择</option>'+separate+page;
    if(known(select))$('list').value=select;
  }
  const disconnectedBy=error=>!db||['capability','open','blocked','worker-error','messageerror','protocol','transport','timeout','closed','cancelled'].includes(error?.phase);
  function resetConnection(){db?.close();db=null;recent=null;showRows([]);$('slot').value='';}
  function fail(error){
    const disconnected=disconnectedBy(error);
    if(disconnected)resetConnection();
    const next=disconnected?'请重新选择同一实验槽，再刷新并选择编号核对。':'请刷新后选择编号重新校验。';
    const outcome=error?.committed===true?`快照已写入，但回读校验未完成。编号：${error.checkpoint||''}。不是已验证备份。${next}`
      :error?.committed===null?`提交结果无法确定：快照可能已写入，但尚未验证，不能确认已保存或未写入。${next}`
      :`操作未完成：${error?.message||String(error)}。当前战局未改变；已有检查点不会被覆盖。${disconnected?'检查点连接不可用，不会改用其他保存方式。':''}`;
    status(outcome+'上方“导出存档 JSON”仍可使用。');
  }
  async function task(run){if(!valid()||busy)return;busy=true;const id=++token;render();try{await run(()=>valid()&&id===token);}catch(error){if(valid()&&id===token)fail(error);}finally{if(valid()&&id===token){busy=false;render();}else if(!valid()){dispose();}}}
  $('slot').onchange=()=>task(async current=>{if($('slot').value!==MANUAL_CHECKPOINT_SLOT){resetConnection();status('请选择手动实验槽。');return;}db?.close();db=null;recent=null;showRows([]);status('正在打开所选实验槽；不会读取其他存档。');const controller=new AbortController();opening=controller;let opened;try{opened=await open({name:MANUAL_CHECKPOINT_SLOT,signal:controller.signal});}finally{if(opening===controller)opening=null;}if(!current()){opened.close();return;}db=opened;const list=await db.list({limit:20});if(current()){showRows(list);status('列表尚未校验。请选择编号，或保存当前快照。');}});
  $('create').onclick=event=>{
    if(event?.detail>1||!valid()||busy||!db)return;
    let text,stamp;
    try{const captured=getState();text=JSON.stringify(captured);if(text.length>20000000)throw Error('完整快照超过 20 M 字符，未保存；不会丢失撤销记录。');stamp={turn:captured.turn,revision:captured.revision||0,history:captured.history?.length||0};}catch(error){fail(error);return;}
    return task(async current=>{
      clearSelection();
      status(`正在保存第 ${stamp.turn} 回合、修订 ${stamp.revision} 的完整快照。`);
      const saved=await db.save(text);if(!current())return;
      try{validateResult('save',saved,{});}catch{throw Object.assign(Error('回读校验未完成。'),{phase:'protocol',committed:saved?.committed===true?true:null,checkpoint:saved?.checkpoint});}
      recent={checkpoint:saved.checkpoint,stateSha256:saved.stateSha256};
      const savedStatus=`已写入并回读校验第 ${stamp.turn} 回合、修订 ${stamp.revision} 的快照，含 ${stamp.history} 条撤销记录。编号：${saved.checkpoint}。后续操作不在本快照内；不是云备份。`;
      // Read-only first-page refresh. A separate recent option never changes the real page/cursor.
      try{
        const list=await db.list({limit:20});if(!current())return;
        showRows(list,{select:saved.checkpoint});
        status(savedStatus+'已选中刚保存的编号，请点击“校验所选快照”，再下载。');
      }catch(error){
        if(!current())return;
        const disconnected=disconnectedBy(error);
        if(disconnected)resetConnection();else showRows(rows,{select:saved.checkpoint});
        status(savedStatus+'编号列表刷新未完成。'+(disconnected?'请重新选择同一实验槽，再按上述编号核对。':'刚保存编号已保留，可点击校验；刷新可重新读取编号列表。')+'上方“导出存档 JSON”仍可使用。');
      }
    });
  };
  $('refresh').onclick=()=>task(async current=>{if(!db)return;status('正在读取编号列表。');const list=await db.list({limit:20});if(current()){showRows(list);status('列表已刷新，所列快照尚未校验。');}});
  $('next').onclick=()=>task(async current=>{if(!db||rows.length!==20)return;const cursor=rows.at(-1).checkpoint;const list=await db.list({limit:20,after:cursor});if(current()){showRows(list);status('已读取下一页；刷新可回到第一页。');}});
  $('list').onchange=()=>{if(!valid()||busy)return;verified=null;$('info').textContent='';render();};
  $('verify').onclick=()=>task(async current=>{const checkpoint=$('list').value;if(!db||!known(checkpoint))return;verified=null;$('info').textContent='';status('正在完整校验所选快照，当前战局不会改变。');const result=await db.read(checkpoint);if(!current())return;validateResult('read',result,{checkpoint});verified=result;const s=result.summary;$('info').textContent=`已校验：第 ${s.turn} 回合 · 修订 ${s.revision} · 种子 ${s.seed} · ${s.historyLength} 条撤销记录。编号 ${checkpoint}；内容 ${result.stateSha256}。`;status('可点击下载已校验的完整 JSON。不会载入当前战局。');});
  $('export').onclick=event=>{if(event?.detail>1||!valid()||busy||!verified||verified.checkpoint!==$('list').value)return;try{download(`mistbound-checkpoint-${verified.checkpoint.slice(0,12)}.json`,verified.text);status('已发起下载，请确认文件确实保存；尚未标记为外部备份。');}catch(error){fail(error);}};
  function dispose(){if(ended)return;ended=true;token++;verified=null;recent=null;rows=[];opening?.abort();opening=null;db?.close();db=null;}
  // Morph/reused DOM can retain select.value and old children. A mount is always disconnected.
  if(valid()){$('slot').value='';showRows([]);status('请选择手动实验槽。');}
  render();return dispose;
}
