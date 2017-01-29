function getCSS(class)
{
   var sheet, rules, cur, i;

   sheet = document.styleSheets[0]
   rules = sheet.cssRules? sheet.cssRules: sheet.rules;

   for (i=0; i<rules.length; i++)
   {
       cur = rules[i];
       if(cur.selectorText.toLowerCase()==class)
           return cur;
   }
   return null;
}
