const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'assets', 'css', 'style.css');
const marker = '/* FOOTER LOGO VISIBILITY PANEL */';

const footerLogoCss = `

${marker}
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

const css = fs.readFileSync(cssPath, 'utf8');
if (!css.includes(marker)) {
  fs.appendFileSync(cssPath, footerLogoCss, 'utf8');
}
