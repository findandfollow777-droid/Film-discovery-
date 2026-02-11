# Replace stats button bars with SVG
/^        <div class="icon-symbol">$/{
  N
  N
  N
  N
  s|        <div class="icon-symbol">\n          <div class="bar bar-1"></div>\n          <div class="bar bar-2"></div>\n          <div class="bar bar-3"></div>\n        </div>|        <svg class="icon-symbol" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="4" y="14" width="4" height="8"/><rect x="10" y="8" width="4" height="14"/><rect x="16" y="4" width="4" height="18"/></svg>|
}
