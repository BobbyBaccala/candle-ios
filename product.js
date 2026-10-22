/* Profile, sources, social learning and Candle+. No sample people or fake paid
   status: unavailable services leave an explicit, usable empty state. */
let profilePage='overview',peopleTab='following',characterTab='hairStyle';
let productMessage='',productBusy=false,productEpoch=0;
let socialModel={accountId:null,profile:null,following:[],followers:[],blocked:[],search:[],entitlement:null,ready:false};
let selectedContact=null;
Object.assign(avatarChoices,CandleCharacter.choices);
if(state.avatar.wardrobeVersion!==3){state.avatar.clothing=0;state.avatar.wardrobeVersion=3}
state.avatar={...state.avatar,...CandleCharacter.normalized(state.avatar,rankInfo().index)};
state.dailyLessons ||= [];
avatarSVG=function(size=76){return CandleCharacter.svg(state.avatar,size,rankInfo().index)};
function hasPlus(){return CandleProduct.plusActive(socialModel.entitlement,cloudUser?.id)}
function productStatus(){return productMessage?'<p class="product-message" role="status">'+esc(productMessage)+'</p>':''}
function productHeader(title,back='overview'){return '<div class="product-heading"><div><button class="product-back" onclick="openProfilePage(\''+back+'\')">← Back</button><h2>'+esc(title)+'</h2></div></div>'}
function productScrollTop(){window.scrollTo?.({top:0,left:0,behavior:'auto'})}
function openProfilePage(page){profilePage=page;productMessage='';tab='Profile';lesson=null;render();productScrollTop()}
function emptyPeople(title,copy){return '<div class="empty-state"><div class="empty-icon" aria-hidden="true">♧</div><h3>'+esc(title)+'</h3><p>'+esc(copy)+'</p></div>'}
function accountGate(copy='Sign in to connect with people you know.') {
  return '<section class="card"><h3>Your learning, together</h3><p class="product-note">'+esc(copy)+'</p><form class="product-form" onsubmit="event.preventDefault();productSignIn()"><label for="accountEmail">Email address</label><input class="product-input" id="accountEmail" type="email" autocomplete="email" required placeholder="you@example.com"><button class="btn" type="submit" '+(productBusy?'disabled':'')+'>Email me a sign-in link</button><small class="product-note">We’ll email a secure sign-in link. You can keep learning without an account.</small></form></section>';
}
async function productSignIn(){
  const email=document.getElementById('accountEmail')?.value?.trim();
  if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){productMessage='Enter a valid email address.';renderProfile();return}
  if(!cloud){productMessage='Account sign-in is unavailable right now. Your local lessons still work.';renderProfile();return}
  productBusy=true;
  try{const options=location.protocol==='https:'?{emailRedirectTo:location.origin+location.pathname}:{};const {error}=await cloud.auth.signInWithOtp({email,options});if(error)throw error;productMessage='Check your email for a secure sign-in link. If you opened a downloaded preview, return to the hosted app to finish signing in.'}
  catch(error){productMessage='We couldn’t send the sign-in link. Please try again.'}
  finally{productBusy=false;renderProfile()}
}
function cleanPerson(p){
  if(!/^[0-9a-f-]{36}$/i.test(p.user_id||''))return null;
  return {user_id:p.user_id,display_name:String(p.display_name||'Learner').slice(0,24),username:String(p.username||'').slice(0,20),
    mutual:p.mutual===true,streak:Math.max(0,Number(p.streak)||0),you_today:p.you_today===true,friend_today:p.friend_today===true};
}
async function refreshProduct(){
  const userId=cloudUser?.id,epoch=++productEpoch;
  if(!userId||socialModel.accountId!==userId){socialModel={accountId:userId||null,profile:null,following:[],followers:[],blocked:[],search:[],entitlement:null,ready:false};selectedContact=null;updateEnergyUI()}
  if(!userId)return;
  try{
    const data=await cloudCall('candle_social_snapshot');
    if(epoch!==productEpoch||userId!==cloudUser?.id)return;
    const value=typeof data==='string'?JSON.parse(data):data;
    socialModel={...socialModel,profile:value.profile,following:(value.following||[]).map(cleanPerson).filter(Boolean),followers:(value.followers||[]).map(cleanPerson).filter(Boolean),blocked:(value.blocked||[]).map(cleanPerson).filter(Boolean),entitlement:value.entitlement||null,ready:true};
    if(cloudProfile&&value.profile?.friend_code)cloudProfile.friend_code=value.profile.friend_code;
  }catch(error){
    if(epoch!==productEpoch||userId!==cloudUser?.id)return;
    socialModel={...socialModel,ready:false,entitlement:null};
    productMessage='Friends and Candle+ accounts are not available on this version yet. Your lessons and character still work.';
  }
  updateEnergyUI();
  if(tab==='Profile'&&lesson===null)renderProfile();
}
async function productSessionChanged(){await refreshProduct();await resolveFollowInvitation();if(tab==='Profile'&&lesson===null)renderProfile()}
const socialCloudRefresh=cloudRefresh;
cloudRefresh=async function(){await socialCloudRefresh();await refreshProduct()};
function personCard(p,index,collection){
  const following=collection==='following'||socialModel.following.some(f=>f.user_id===p.user_id),blocked=collection==='blocked';
  const streak=p.mutual?'<div class="shared-streak">'+p.streak+' day friend streak · '+(p.you_today&&p.friend_today?'Both finished today':p.you_today?'You’re done. Waiting for your friend.':p.friend_today?'Your friend is done. Your turn!':'A lesson each keeps it going.')+'</div>':'';
  return '<div class="social-row"><div style="flex:1;min-width:0"><div class="social-person"><div class="person-medallion" aria-hidden="true">'+esc(p.display_name.slice(0,1).toUpperCase())+'</div><span><strong>'+esc(p.display_name)+'</strong><small>@'+esc(p.username||'learner')+(p.mutual?' · Following each other':'')+'</small></span></div>'+streak+'</div><div class="social-actions">'+
    (blocked?'<button class="soft-button" onclick="personAction(\'unblock\','+index+',\''+collection+'\')">Unblock</button>':'<button class="soft-button" onclick="personAction(\''+(following?'unfollow':'follow')+'\','+index+',\''+collection+'\')">'+(following?'Following ✓':collection==='followers'?'Follow back':'Follow')+'</button><button class="soft-button" onclick="personAction(\'block\','+index+',\''+collection+'\')" aria-label="Block '+esc(p.display_name)+'">Block</button><button class="soft-button" onclick="personAction(\'report\','+index+',\''+collection+'\')">Report</button>')+'</div></div>';
}
async function personAction(action,index,collection){
  const person=socialModel[collection]?.[index];if(!person||productBusy)return;
  if(action==='block'&&!confirm('Block @'+person.username+'? You will unfollow each other and stop sharing streaks.'))return;
  if(action==='report'&&!confirm('Report this profile for review? You can also block them to stop interactions.'))return;
  productBusy=true;
  try{await cloudCall('candle_social_action',{p_target:person.user_id,p_action:action});productMessage=action==='report'?'Report received. You can block this person while it is reviewed.':action==='follow'?'Following. Follow each other to start a friend streak.':action==='unfollow'?'Unfollowed.':action==='block'?'Profile blocked.':'Profile unblocked.';socialModel.search=[];await refreshProduct()}
  catch(error){productMessage='That change couldn’t be saved. Please try again.'}
  finally{productBusy=false;renderProfile()}
}
function renderProfileHome(){
  const name=socialModel.profile?.display_name||state.avatar.name,mutual=socialModel.following.filter(p=>p.mutual),best=Math.max(0,...mutual.map(p=>p.streak));
  return '<div class="profile-shell"><div class="profile-topline"><div><div class="eyebrow">YOUR CORNER</div><h2>Profile</h2></div><button class="icon-button" onclick="openProfilePage(\'settings\')" aria-label="Settings">⚙</button></div><section class="profile-hero"><div><div class="eyebrow">'+(hasPlus()?'CANDLE+ · '+esc(rankInfo().name):esc(rankInfo().name))+'</div><h2>'+esc(name)+'</h2><p>'+(socialModel.profile?.username?'@'+esc(socialModel.profile.username):'A little wiser, one lesson at a time.')+'</p><button class="soft-button" onclick="openProfilePage(\'character\')">Edit character</button></div>'+avatarSVG(132)+'</section><div class="social-counts"><button onclick="showPeople(\'following\')"><strong>'+socialModel.following.length+'</strong><small>Following</small></button><button onclick="showPeople(\'followers\')"><strong>'+socialModel.followers.length+'</strong><small>Followers</small></button><button onclick="showPeople(\'following\')"><strong>'+best+'</strong><small>Best friend streak</small></button></div><div class="profile-actions"><button class="btn" onclick="openProfilePage(\'find\')">＋ Add friends</button><button class="soft-button" onclick="showPeople(\'following\')">Your friend streaks</button></div><div class="product-stats"><div><strong>'+state.xp+'</strong><small>Total XP</small></div><div><strong>'+state.streak+'</strong><small>Day streak</small></div><div><strong>'+state.done.length+'</strong><small>Lessons completed</small></div></div><section class="streak-card"><h3>Better together</h3><p>Follow each other, then finish a lesson each day. Your shared streak grows only when both of you show up.</p><small class="product-note">Friend days reset at midnight UTC. Personal streaks use your device’s local day.</small></section>'+(!cloudUser?accountGate():'')+'<section class="plus-card"><div class="eyebrow">CANDLE +</div><h3>Keep your curiosity going.</h3><p>Unlimited learning energy. The same thoughtful lessons, at your own pace.</p><button class="btn" onclick="openProfilePage(\'plus\')">'+(hasPlus()?'Manage Candle+':'Explore Candle+')+'</button></section>'+productStatus()+'</div>';
}
function showPeople(which){peopleTab=which;openProfilePage('people')}
function renderPeople(){
  const people=socialModel[peopleTab];
  return productHeader('Your people')+'<div class="product-tabs"><button class="'+(peopleTab==='following'?'active':'')+'" onclick="showPeople(\'following\')">Following</button><button class="'+(peopleTab==='followers'?'active':'')+'" onclick="showPeople(\'followers\')">Followers</button></div>'+productStatus()+(!cloudUser?accountGate():'<section class="card">'+(people.length?people.map((p,i)=>personCard(p,i,peopleTab)).join(''):emptyPeople(peopleTab==='following'?'Start your learning circle':'Your circle will grow','Invite someone you know. Follow each other to build a daily friend streak.'))+'</section>')+'<button class="btn" style="width:100%" onclick="openProfilePage(\'find\')">＋ Add friends</button>';
}
function renderFind(){
  return productHeader('Find my friends')+'<p class="product-note">Learn alongside people you know. You choose who to follow.</p><div class="find-options"><button class="find-option" onclick="openProfilePage(\'search\')"><span class="find-symbol" aria-hidden="true">⌕</span><span><strong>Search by username</strong><small>Find another learner inside Candle</small></span></button><button class="find-option" onclick="chooseContact()"><span class="find-symbol" aria-hidden="true">♧</span><span><strong>Choose from contacts</strong><small>Invite a selected person. Your address book stays private.</small></span></button><button class="find-option" onclick="shareFollowLink()"><span class="find-symbol" aria-hidden="true">↗</span><span><strong>Share your follow link</strong><small>Send an invitation using your share sheet</small></span></button></div>'+productStatus()+(!cloudUser?accountGate('Sign in to create your follow link and search for friends.'):'')+(selectedContact?'<section class="card"><h3>Invite '+esc(selectedContact.name)+'</h3><p class="product-note">Only this selected contact is used. Review and send the invitation in your email app.</p><a class="btn" href="'+esc(selectedContact.mailto)+'">Open invitation draft</a></section>':'')+'<section class="card"><h3>Two people. One shared streak.</h3><p class="product-note">Once you follow each other, each day you both finish a lesson adds one to your shared streak. Replaying a lesson counts; opening the app doesn’t.</p></section>';
}
function renderSearch(){return productHeader('Search Candle','find')+'<section class="card"><form class="product-form" onsubmit="event.preventDefault();searchFriends()"><label for="friendUsername">Username</label><input class="product-input" id="friendUsername" autocapitalize="none" autocomplete="off" spellcheck="false" maxlength="20" placeholder="e.g. curious_candle"><button class="btn" type="submit" '+(productBusy?'disabled':'')+'>Find learner</button></form><p class="product-note">Enter at least 3 characters. Only learners who allow username discovery appear.</p>'+productStatus()+socialModel.search.map((p,i)=>personCard(p,i,'search')).join('')+'</section>'}
async function searchFriends(){
  const query=document.getElementById('friendUsername')?.value?.trim().toLowerCase().replace(/^@/,'');
  if(!cloudUser){productMessage='Sign in first to search for friends.';renderProfile();return}
  if(!/^[a-z][a-z0-9_]{2,19}$/.test(query||'')){productMessage='Enter 3–20 characters: letters, numbers or underscores, starting with a letter.';renderProfile();return}
  productBusy=true;
  try{socialModel.search=(await cloudCall('candle_search_people',{p_query:query})||[]).map(cleanPerson).filter(Boolean);productMessage=socialModel.search.length?'':'No matching learners found. Check the username or ask them for a follow link.'}
  catch(error){productMessage='Search is unavailable right now. Please try again.'}
  finally{productBusy=false;renderProfile()}
}
function currentFollowLink(){
  const base=window.CANDLE_CLOUD?.publicAppUrl||(location.protocol==='https:'?location.origin+location.pathname:null);
  return base?CandleProduct.followLink(base,socialModel.profile?.friend_code||cloudProfile?.friend_code):null;
}
async function shareFollowLink(){
  if(!cloudUser){productMessage='Sign in to create your personal follow link.';renderProfile();return}
  const url=currentFollowLink();
  if(!url){productMessage='Follow links are available in the hosted app after signing in.';renderProfile();return}
  try{if(navigator.share){await navigator.share({title:'Learn with me on Candle',text:'Follow me on Candle and let’s build a friend streak.',url});productMessage='Share sheet closed. Invitations are only sent when you choose to send them.'}
    else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);productMessage='Your follow link was copied. Share it with someone you know.'}
    else{productMessage='Your follow link: '+url}}
  catch(error){productMessage=error.name==='AbortError'?'Invitation cancelled.':'Sharing wasn’t available. Please try again.'}
  renderProfile();
}
async function chooseContact(){
  selectedContact=null;
  if(!cloudUser){productMessage='Sign in before inviting a contact.';renderProfile();return}
  const url=currentFollowLink();if(!url){productMessage='Contact invitations are available from the hosted app.';renderProfile();return}
  if(!navigator.contacts?.select&&!window.CandleNative?.pickContact){productMessage='This browser doesn’t offer a contact picker. Use Share your follow link and choose a person in your phone’s share sheet. The native iPhone contact picker still needs to be connected.';renderProfile();return}
  try{const contacts=window.CandleNative?.pickContact?[await window.CandleNative.pickContact()]:await navigator.contacts.select(['name','email'],{multiple:false});const contact=contacts[0];if(!contact)return;
    const email=contact.email?.find(e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)&&!/[\r\n]/.test(e));
    if(!email){productMessage='This contact has no email address. You can still share your follow link.'}
    else{selectedContact={name:String(contact.name?.[0]||'your friend').slice(0,80),mailto:'mailto:'+encodeURIComponent(email)+'?subject='+encodeURIComponent('Learn with me on Candle')+'&body='+encodeURIComponent('Join me on Candle and let’s build a friend streak: '+url)};productMessage='Your contact stays on this device. Nothing has been sent.'}
  }catch(error){productMessage=error.name==='AbortError'?'Contact selection cancelled.':'Contact selection wasn’t available. You can share a follow link instead.'}
  renderProfile();
}
function renderSettings(){
  const row=(title,subtitle,target)=>'<button class="settings-row" onclick="openProfilePage(\''+target+'\')"><span><strong>'+title+'</strong><small>'+subtitle+'</small></span><span aria-hidden="true">›</span></button>';
  return productHeader('Settings')+'<section class="card">'+row('Account & username','Sign-in, discovery and your public name','account')+row('Candle+','Unlimited energy and membership','plus')+row('Sources & learning standards','What informs each concept and how we review it','sources')+row('Privacy & safety','Contacts, data, blocked accounts and deletion','privacy')+'</section><section class="card"><h3>Your device</h3><p class="product-note">Your character and lesson progress are stored in this browser. An account connects your social profile and shared activity.</p><button class="soft-button" onclick="reset()">Reset local learning progress</button></section><p class="product-note">Candle teaches financial concepts. It does not place trades or provide personalized investment advice.</p>'+productStatus();
}
function renderSources(){
  const locators={finance:'Undergraduate finance: financial statements, time value, valuation, interest rates and risk/return.',portfolio:'Section 15.2: diversification, common market risk and company-specific risk.',literacy:'Review sections on measuring literacy, compounding, inflation and diversification.',oecd:'Financial literacy content domains and processes: planning, evaluating risk and applying knowledge.',capability:'Executive function, financial habits, and financial knowledge/decision-making.',trading:'Risk, borrowing, costs and unreliable claims of easy trading profits.',execution:'Market, limit, stop and stop-limit order sections.',charts:'Lesson 8: descriptive OHLC, candle and volume terminology.',bias:'Learning outcomes and summaries of anchoring, confirmation, hindsight and other biases.',testing:'Research abstract: testing many trading rules can introduce data-snooping bias.'};
  return productHeader('Sources & learning standards','settings')+'<section class="card"><h3>Know what’s behind the lesson.</h3><p class="product-note">Our questions are original scenarios informed by textbooks, research and public education guidance. Each source below shows the concepts and learning goals it supports. No institution endorses Candle.</p>'+CandleProduct.sourceGroups(CandleCurriculum).map(s=>'<details class="source-item"><summary>'+esc(s.title)+'</summary><p>'+esc(locators[s.id]||'Background reading for these concepts.')+'</p><ul>'+s.concepts.map(c=>'<li><strong>'+esc(c.key.replaceAll('-',' '))+':</strong> '+esc(c.objective)+'</li>').join('')+'</ul><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">Open original publication ↗</a></details>').join('')+'</section><section class="card"><h3>How we write questions</h3><p class="product-note">No calculator needed. Foundation lessons use three reasoning tasks; case files use five distinct tasks. We check repeated wording, concepts, answer keys and references. Source-informed does not mean independently validated: educator review and learner studies remain part of our release work.</p></section>';
}
function renderAccount(){return productHeader('Account & username','settings')+(!cloudUser?accountGate():'<section class="card"><p class="product-note">Signed in as '+esc(cloudUser.email||'your account')+'</p><form class="product-form" onsubmit="event.preventDefault();savePublicProfile()"><label for="publicName">Display name</label><input class="product-input" id="publicName" maxlength="24" value="'+esc(socialModel.profile?.display_name||state.avatar.name)+'"><label for="publicUsername">Username</label><input class="product-input" id="publicUsername" maxlength="20" autocapitalize="none" autocomplete="off" spellcheck="false" value="'+esc(socialModel.profile?.username||'')+'" placeholder="curious_candle"><label class="check-label"><input id="discoverable" type="checkbox" '+(socialModel.profile?.discoverable?'checked':'')+'>Let people find me by username. My email stays private.</label><button class="btn" type="submit">Save profile</button></form><p class="product-note">Following each other shares daily lesson activity for friend streaks. Only your public name and username appear in search.</p><button class="soft-button" onclick="productSignOut()">Sign out</button></section>')+productStatus()}
async function savePublicProfile(){
  const name=document.getElementById('publicName')?.value?.trim(),username=document.getElementById('publicUsername')?.value?.trim().toLowerCase(),discoverable=document.getElementById('discoverable')?.checked===true;
  if(!name||name.length>24||!CandleProduct.validUsername(username||'')){productMessage='Choose a name and a username of 3–20 letters, numbers or underscores, starting with a letter.';renderProfile();return}
  try{await cloudCall('candle_update_social_profile',{p_name:name,p_username:username,p_discoverable:discoverable});state.avatar.name=name;save();productMessage='Profile saved.';await refreshProduct()}
  catch(error){productMessage='That username may be unavailable, or the profile could not be saved. Please try another.'}
  renderProfile();
}
async function productSignOut(){try{if(cloud)await cloud.auth.signOut()}catch(error){}cloudUser=null;cloudProfile=null;cloudBoard=[];selectedContact=null;await refreshProduct();productMessage='Signed out. Local lessons and your character are still here.';renderProfile()}
function renderPrivacy(){return productHeader('Privacy & safety','settings')+'<section class="card"><h3>You choose what to share.</h3><p class="product-note">Contacts are selected one at a time for invitations and are never uploaded to build an address-book database. Email is used for account sign-in; Candle+ launch emails require a separate choice.</p><p class="product-note">Public names and usernames can appear in discovery if you turn it on. People you follow can see leaderboard scores. Mutual followers share the days they finish lessons to support friend streaks.</p><h3>Blocked accounts</h3>'+(socialModel.blocked.length?socialModel.blocked.map((p,i)=>personCard(p,i,'blocked')).join(''):emptyPeople('No blocked accounts','You can block or report a profile from Following, Followers or search.'))+'</section><section class="card"><h3>Account deletion</h3><p class="product-note">Delete your account and associated cloud data. Apple subscriptions must be managed separately; deleting an account does not cancel billing.</p><button class="soft-button" onclick="deleteCandleAccount()" '+(!cloudUser?'disabled':'')+'>Delete my account</button></section>'+productStatus()}
async function deleteCandleAccount(){
  if(!cloudUser||!confirm('Permanently delete your Candle account, social connections and cloud activity? This cannot be undone. Apple billing is managed separately.'))return;
  // Deletion is an authenticated server function that checks a recent login.
  try{const {error}=await cloud.functions.invoke('delete-account');if(error)throw error;await productSignOut();productMessage='Account deleted. You can reset local learning progress in Settings.'}
  catch(error){productMessage='Account deletion could not be completed. Sign in again and retry. The account has not been marked as deleted.'}
  renderProfile();
}
function renderPlus(){
  const active=hasPlus();
  return productHeader('Candle+','settings')+'<section class="card"><span class="plan-badge">CANDLE +</span><h2>More room to learn.</h2><p class="product-note">Keep going when curiosity strikes, with unlimited learning energy.</p><div class="plan-benefits"><div><span aria-hidden="true">∞</span><span><strong>Unlimited energy</strong><p>Start and replay lessons without waiting for a refill.</p></span></div><div><span aria-hidden="true">✓</span><span><strong>Your learning stays yours</strong><p>Keep your progress, character and friend streaks on either plan.</p></span></div></div>'+(active?'<p class="product-message">'+(socialModel.entitlement.source==='preview'?'Your free Candle+ preview is active until '+esc(new Date(socialModel.entitlement.valid_until).toLocaleDateString())+'. It will not renew or charge you.':'Candle+ is active on your account.')+'</p><div class="compact-actions"><button class="btn" onclick="managePlus()">Manage membership</button><button class="soft-button" onclick="restorePlus()">Restore purchases</button></div>':'<p class="product-note">Paid membership is preparing for launch. Sign up and verify your email to start a free 7-day Candle+ preview. No payment, automatic renewal or paid subscription starts here.</p><button class="btn" style="width:100%" onclick="openProfilePage(\'plusSignup\')">Sign up by email</button><button class="soft-button" style="width:100%;margin-top:10px" onclick="restorePlus()">Restore purchases</button>')+'</section>'+productStatus();
}
function renderPlusSignup(){return productHeader('Try Candle+','plus')+(!cloudUser?accountGate('Create or sign in to your account by email. After verification, you can start one free 7-day Candle+ preview.'):'<section class="card"><h3>Follow your curiosity.</h3><p class="product-note">Your verified account is '+esc(cloudUser.email||'ready')+'. Start a free 7-day preview of unlimited energy. One preview per account; no charge and no automatic renewal.</p><button class="btn" style="width:100%" onclick="startPlusPreview()" '+(productBusy?'disabled':'')+'>Start my free preview</button><hr style="border:0;border-top:1px solid #e1e8da;margin:24px 0"><form class="product-form" onsubmit="event.preventDefault();joinPlusList()"><label class="check-label"><input id="plusConsent" type="checkbox" required>Also email me about the Candle+ launch. This is optional and separate from the free preview.</label><button class="soft-button" type="submit">Save email preference</button></form><button class="soft-button" style="margin-top:12px" onclick="leavePlusList()">Leave launch list</button></section>')+productStatus()}
async function startPlusPreview(){
  if(!cloudUser||productBusy)return;productBusy=true;
  try{await cloudCall('candle_start_plus_preview');await refreshProduct();productMessage=hasPlus()?'Your Candle+ preview is ready. Enjoy unlimited energy.':'No active preview was confirmed. You may have already used your free preview.'}
  catch(error){productMessage='The free preview could not be started. Verify your email and try again. If you already used a preview, it cannot be restarted.'}
  finally{productBusy=false;renderProfile()}
}
async function joinPlusList(){
  if(!cloudUser||document.getElementById('plusConsent')?.checked!==true){productMessage='Sign in and choose whether to receive launch emails first.';renderProfile();return}
  try{await cloudCall('candle_plus_interest',{p_opt_in:true});productMessage='You’re on the Candle+ launch list. Your current plan has not changed.'}catch(error){productMessage='We couldn’t save your signup. Please try again.'}renderProfile();
}
async function leavePlusList(){try{await cloudCall('candle_plus_interest',{p_opt_in:false});productMessage='You’ve left the Candle+ launch list.'}catch(error){productMessage='We couldn’t update that preference. Please try again.'}renderProfile()}
async function restorePlus(){
  try{if(window.CandleNative?.restorePurchases)await window.CandleNative.restorePurchases();await refreshProduct();productMessage=hasPlus()?'Your Candle+ membership is restored.':'No active Candle+ membership was found for this account.'}
  catch(error){productMessage='Purchases could not be restored. Please try again from the iPhone app.'}renderProfile();
}
function managePlus(){if(socialModel.entitlement?.source==='preview'){productMessage='Your free preview ends automatically. There is no payment to cancel.';renderProfile()}else if(window.CandleNative?.manageSubscriptions)window.CandleNative.manageSubscriptions();else{productMessage='Manage an Apple subscription in your iPhone Settings → your name → Subscriptions.';renderProfile()}}
function renderCharacter(){
  const labels={hairStyle:'Hair style',skin:'Skin tone',hair:'Hair color',face:'Face shape',eyes:'Eye color',brows:'Brows',expression:'Expression',clothing:'Rank wardrobe',outfit:'Cap color',accessory:'Accessories',background:'Backdrop'};
  const colors=['skin','hair','eyes','outfit','background'].includes(characterTab);
  const rank=rankInfo(),isWardrobe=characterTab==='clothing';
  const options=isWardrobe?CandleCharacter.wardrobe.map((fit,i)=>{
    const unlocked=CandleCharacter.unlocked(i,rank.index);
    return '<button class="character-option wardrobe-option '+(state.avatar.clothing===i?'selected':'')+'" onclick="setCharacterChoice('+i+')" '+(unlocked?'':'disabled')+' aria-pressed="'+(state.avatar.clothing===i)+'" aria-label="'+esc(fit.name)+(unlocked?' — available':' — unlock at '+levelNames[fit.rank])+'">'+CandleCharacter.svg({...state.avatar,clothing:i},68,fit.rank)+'<strong>'+esc(fit.name)+'</strong><small>'+(unlocked?'Unlocked':esc(levelNames[fit.rank])+' · '+(fit.rank*850)+' points')+'</small></button>';
  }).join(''):avatarChoices[characterTab].map((value,i)=>'<button class="character-option '+(state.avatar[characterTab]===i?'selected':'')+'" onclick="setCharacterChoice('+i+')" aria-pressed="'+(state.avatar[characterTab]===i)+'" aria-label="'+labels[characterTab]+' '+(i+1)+'">'+(colors?'<span class="color-dot" style="background:'+value+'"></span><span>Shade '+(i+1)+'</span>':esc(value))+'</button>').join('');
  return productHeader('Make your trader yours')+'<div class="character-controls"><div class="character-stage">'+avatarSVG(170)+'</div><div class="wardrobe-rank"><span class="eyebrow">'+esc(rank.name)+'</span><p>'+esc(CandleCharacter.wardrobe[state.avatar.clothing].name)+'</p><button class="soft-button" onclick="setCharacterTab(\'clothing\')">View rank wardrobe</button></div><div class="character-tabs" role="group" aria-label="Character categories">'+Object.entries(labels).map(([key,label])=>'<button class="'+(key===characterTab?'active':'')+'" onclick="setCharacterTab(\''+key+'\')" aria-pressed="'+(key===characterTab)+'">'+label+'</button>').join('')+'</div><section class="card" style="margin:0"><h3>'+labels[characterTab]+'</h3>'+(isWardrobe?'<p class="product-note">Everyone starts in a black suit and tie. Earn meme ranks through lessons to unlock the rest. Outfits are earned, never paid.</p>':'')+'<div class="character-options '+(isWardrobe?'wardrobe-options':'')+'">'+options+'</div></section><section class="card" style="margin:0"><label for="avatarName">Character name</label><input class="product-input" id="avatarName" maxlength="18" value="'+esc(state.avatar.name)+'"><button class="btn" style="width:100%;margin-top:12px" onclick="renameAvatar()">Save name</button></section></div>';
}
function setCharacterTab(key){if(!avatarChoices[key])return;characterTab=key;renderProfile()}
function setCharacterChoice(index){if(!Number.isInteger(index)||index<0||index>=avatarChoices[characterTab].length)return;if(characterTab==='clothing'&&!CandleCharacter.unlocked(index,rankInfo().index))return;state.avatar[characterTab]=index;save();renderProfile()}
function renderAIReview(l,q){
  if(!checked)return '';
  const text=CandleAI.prompt(l,q,CandleCurriculum.sources);
  return '<aside class="ai-review-tray" aria-label="Optional AI study helpers"><div class="ai-review-heading"><strong>Go deeper with AI</strong><span>Choose your tutor ↗</span></div><div class="ai-review-providers">'+CandleAI.providers.map(provider=>{
    const target=CandleAI.destination(provider.id,text);
    return '<a class="ai-provider ai-'+provider.id+'" href="'+esc(target.url)+'" target="_blank" rel="noopener noreferrer external" referrerpolicy="no-referrer" onclick="aiProviderClick(\''+provider.id+'\')" aria-label="Study this question with '+provider.name+' — opens another app" title="'+(target.prefilled?'Open with the lesson prompt where supported':'Copy prompt and open; paste it in the chat')+'">'+CandleAIIcons[provider.id]+'<span>'+provider.name+'</span></a>';
  }).join('')+'</div><small class="ai-review-note">Opens your AI with lesson content; it may start a chat. Gemini uses copy + open.</small><details class="ai-prompt-details" id="aiPromptDetails"><summary>View / copy study prompt</summary><label class="sr-only" for="aiStudyPrompt">Study prompt to paste into an AI chat</label><textarea id="aiStudyPrompt" rows="7" readonly>'+esc(text)+'</textarea><button class="soft-button" onclick="copyAIStudyPrompt()">Copy prompt</button></details><span class="ai-review-status" id="aiReviewStatus" role="status" aria-live="polite"></span><small class="ai-review-note">AI can make mistakes. Compare its explanation with the lesson; ask it to flag assumptions.</small></aside>';
}
async function copyAIStudyPrompt(){
  if(lesson===null||!checked)return false;
  const q=lessons[lesson].qs[question],text=CandleAI.prompt(lessons[lesson],q,CandleCurriculum.sources),id=q.id;
  try{
    if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);
    if(lesson!==null&&lessons[lesson].qs[question].id===id){const status=document.getElementById('aiReviewStatus');if(status)status.textContent='Study prompt copied. Paste it if your AI chat opens blank.'}
    return true;
  }catch(error){
    if(lesson!==null&&lessons[lesson].qs[question].id===id){const box=document.getElementById('aiPromptDetails');if(box)box.open=true;const status=document.getElementById('aiReviewStatus');if(status)status.textContent='Copy wasn’t available. Select the prompt text above and copy it manually.'}
    return false;
  }
}
function aiProviderClick(id){
  if(lesson===null||!checked||!CandleAI.providers.some(p=>p.id===id))return;
  // The normal anchor opens the provider synchronously. Copying is a fallback,
  // never a background API call or an attempted chat submission by Candle.
  void copyAIStudyPrompt();
}
renderProfile=function(){
  const pages={overview:renderProfileHome,settings:renderSettings,sources:renderSources,people:renderPeople,find:renderFind,search:renderSearch,account:renderAccount,privacy:renderPrivacy,plus:renderPlus,plusSignup:renderPlusSignup,character:renderCharacter};
  app.innerHTML=(pages[profilePage]||renderProfileHome)();
};
const productGo=go;
go=function(page){if(page==='Profile')profilePage='overview';productGo(page);productScrollTop()};
const productAdvance=advance;
advance=function(){
  const priorRank=rankInfo().index;
  const completingUser=cloudUser?.id;
  const completed=lesson!==null&&checked&&question===lessons[lesson].qs.length-1;
  productAdvance();
  productScrollTop();
  if(completed&&lesson===null){
    const newRank=rankInfo().index;
    if(newRank>priorRank){const fit=CandleCharacter.wardrobe[newRank];app.innerHTML+='<section class="card outfit-unlock"><div class="eyebrow">OUTFIT UNLOCKED</div><h3>'+esc(levelNames[newRank])+'</h3>'+CandleCharacter.svg({...state.avatar,clothing:newRank},82,newRank)+'<p>'+esc(fit.name)+'</p><button class="btn" onclick="openProfilePage(\'character\');setCharacterTab(\'clothing\')">Try your new fit</button></section>'}
    const date=CandleProduct.day(new Date());
    if(!state.dailyLessons.includes(date))state.dailyLessons.push(date);
    state.dailyLessons=state.dailyLessons.slice(-400);save();
    if(completingUser)void recordSharedDay(completingUser);
  }
};
async function recordSharedDay(completingUser){
  if(!completingUser||completingUser!==cloudUser?.id)return;
  try{await cloudCall('candle_record_learning_day');await refreshProduct()}
  catch(error){productMessage='Your lesson is saved on this device, but today’s friend streak could not sync. Finish a lesson while connected to try again.'}
}
const productEnergyUI=updateEnergyUI;
updateEnergyUI=function(){productEnergyUI();if(hasPlus()){const el=document.getElementById('energyTop');if(el){el.textContent='∞ Candle+';el.setAttribute('aria-label','Candle Plus: unlimited energy')}}};
const productStart=start;
start=function(index){
  if(!hasPlus()){productStart(index);if(lesson===index)productScrollTop();return}
  // Reuse the existing validation, locking and help setup. A verified member
  // bypasses only the energy gate; restore the underlying free-plan reservoir.
  const energy=state.energy,energyAt=state.energyAt;state.energy=ENERGY_MAX;
  try{productStart(index);if(lesson===index)productScrollTop()}finally{state.energy=energy;state.energyAt=energyAt;save();updateEnergyUI()}
};
const productEnergyInfo=showEnergyInfo;
showEnergyInfo=function(){if(hasPlus()){openProfilePage('plus');return}productEnergyInfo()};
// Accepting a link requires a deliberate follow action. Visiting never follows.
try{const code=new URL(location.href).searchParams.get('follow');if(code&&/^\w{8}$/.test(code))state.pendingFollow=code}catch(error){}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&cloudUser)void refreshProduct()});
async function resolveFollowInvitation(){
  if(!cloudUser||!state.pendingFollow)return;
  try{const people=await cloudCall('candle_resolve_follow_link',{p_code:state.pendingFollow});socialModel.search=(people||[]).map(cleanPerson).filter(Boolean);profilePage='search';tab='Profile';productMessage=socialModel.search.length?'Someone invited you to learn together. Choose Follow to connect.':'This invitation is unavailable.';delete state.pendingFollow;save();render()}
  catch(error){productMessage='That invitation could not be opened. You can search for your friend by username.'}
}
