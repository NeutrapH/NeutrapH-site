const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'assets', 'css', 'style.css');
const aboutPath = path.join(__dirname, '..', 'about.html');
const footerMarker = '/* FOOTER LOGO VISIBILITY PANEL */';

const footerLogoCss = `

${footerMarker}
footer .footer-grid > div:first-child{
  padding:18px 20px;
  border-radius:8px;
  background:rgba(255,255,255,.035);
  border:1px solid rgba(255,255,255,.08);
}
footer .footer-logo-img{
  width:320px!important;
  max-width:100%!important;
  height:auto!important;
  margin-bottom:16px!important;
  padding:20px 26px!important;
  border-radius:8px!important;
  background:linear-gradient(135deg,rgba(238,248,255,.96),rgba(198,236,249,.88))!important;
  border:1px solid rgba(255,255,255,.42)!important;
  box-shadow:0 18px 42px rgba(0,0,0,.18)!important;
  filter:none!important;
}
footer .footer-about{
  color:rgba(255,255,255,.76);
}
@media(max-width:760px){
  footer .footer-logo-img{
    width:250px!important;
    padding:18px 22px!important;
  }
}
`;

const oldFounderBio = `<p>I grew up in Welverdiend, Bushbuckridge, the same community NeutrapH now serves. I watched families, schools and neighbours rely on borehole water that was visibly discoloured, high in salinity and unsafe to drink without boiling. It was a daily inconvenience that nobody should have to accept.</p>
        <p>After studying Chemical Engineering and working as a Process Engineer, I had the technical foundation to understand exactly what was happening to the water and, more importantly, how to fix it. Reverse osmosis was not a new concept in industry, but it had never been accessible and affordable for rural communities like ours.</p>
        <p>NeutrapH was my answer to that gap. Not a corporate project or an outside initiative, just someone from here using what they know to solve a real problem. I built the purification process, designed the delivery model around how people in Bushbuckridge actually live, and kept the pricing honest.</p>
        <p>I am not much for long speeches. I would rather the water speak for itself. But if you are a school principal, a church leader or a family who has been struggling with unsafe water, I understand your situation personally, and I built this specifically for you.</p>`;

const newFounderBio = `<p>I grew up in Welverdiend, Bushbuckridge, the same community NeutrapH now serves. I watched families, schools and neighbours rely on borehole water that often had a noticeable salty taste and an appearance that made many people hesitant to drink it. While the water was generally safe, it was not always pleasant to consume, and many households had simply accepted this as part of daily life.</p>
        <p>After studying Chemical Engineering and working as a Process Engineer, I had the technical foundation to understand exactly what was happening to the water and, more importantly, how to fix it. Reverse osmosis was not a new concept in industry, but it had never been accessible and affordable for rural communities like ours.</p>
        <p>NeutrapH was my answer to that gap. Not a corporate project or an outside initiative, just someone from here using what they know to solve a real problem. I built the purification process, designed the delivery model around how people in Bushbuckridge actually live, and kept the pricing honest.</p>
        <p>I am not much for long speeches. I would rather the water speak for itself. But if you are a school principal, a church leader or a family who has been struggling with poor-tasting borehole water, I understand your situation personally, and I built this specifically for you.</p>`;

function addFooterLogoPanel() {
  const css = fs.readFileSync(cssPath, 'utf8');
  if (!css.includes(footerMarker)) {
    fs.appendFileSync(cssPath, footerLogoCss, 'utf8');
  }
}

function updateFounderBio() {
  const html = fs.readFileSync(aboutPath, 'utf8');
  if (html.includes(newFounderBio)) {
    return;
  }
  if (!html.includes(oldFounderBio)) {
    throw new Error('Founder bio block not found in about.html');
  }
  fs.writeFileSync(aboutPath, html.replace(oldFounderBio, newFounderBio), 'utf8');
}

addFooterLogoPanel();
updateFounderBio();
