import Cookies from 'js-cookie'

const languages = {
    CZ: {
        "App Name": "Gamifikace",
        "Add Quest": "Přidat úkol",
        "Name": "Jméno",
        "Xp": "Xp",
        "Coins": "Mince",
        "Points": "Body",
        "Status": "Status",
        "Dashboard": "Dashboard",
        "Quests": "Úkoly",
        "Shop": "Obchod",
        "Messages": "Zprávy",
        "Add Users": "Přidat uživatele",
        "Download": "Stáhnout",
        "Add Item": "Přidat položku",
        "Price": "Cena",
        "Required Level": "Požadovaný level",
        "Stock": "Zásoba",
        "Purchases": "Nákupy",
        "Username": "Uživatelské jméno",
        "Change Username": "Změnit uživatelské jméno",
        "Change Name": "Změnit jméno",
        "Password": "Heslo",
        "Change Password": "Změnit heslo",
        "Language": "Jazyk",
        "Change Language": "Změnit jazyk",
        "Change Language.": "Změnit jazyk",
        "You have %count% new quests.": "Máte %count% nových úkolů.",
        "There are %count% new items in shop.": "V obchodě je %count% nových položek.",
        "Leave empty to generate a random one": "Ponechte prázdné pro náhodné vygenerování",
        "Groups": "Skupiny",
        "Submit Item": "Odeslat položku",
        "Send Message": "Odeslat zprávu",
        "New Messages": "Nové zprávy",
        "You got %count% new messages.": "Dostal jste %count% nových zpráv.",
        "Current Username": "Současné uživatelské jméno",
        "New Username": "Nové uživatelské jméno",
        "Current Password": "Současné heslo",
        "Current Name": "Současné jméno",
        "New Name": "Nové jméno",
        "New Password": "Nové heslo",
        "Login": "Přihlásit se",
        "Please enter your login and password!": "Prosím zadejte své uživatelské jmáno a heslo!"
    },
    EN: {
        "App Name": "Gamifikace",
        "Add Quest": "Add Quest",
        "Name": "Name",
        "Xp": "Xp",
        "Coins": "Coins",
        "Points": "Points",
        "Status": "Status",
        "Dashboard": "Dashboard",
        "Quests": "Quests",
        "Shop": "Shop",
        "Messages": "Messages",
        "Add Users": "Add Users",
        "Download": "Download",
        "Add Item": "Add Item",
        "Price": "Price",
        "Required Level": "Required Level",
        "Stock": "Stock",
        "Purchases": "Purchases",
        "Username": "Username",
        "Change Username": "Change Username",
        "Change Name": "Change Name",
        "Password": "Password",
        "Change Password": "Change Password",
        "Language": "Language",
        "Change Language": "Change Language",
        "Change Language.": "Change Language",
        "You have %count% new quests.": "You have %count% new quests.",
        "There are %count% new items in shop.": "There are %count% new items in shop.",
        "Leave empty to generate a random one": "Leave empty to generate a random one",
        "Groups": "Groups",
        "Submit Item": "Submit Item",
        "Send Message": "Send Message",
        "New Messages": "New Messages",
        "You got %count% new messages.": "You got %count% new messages.",
        "Current Username": "Current Username",
        "New Username": "New Username",
        "Current Password": "Current Password",
        "Current Name": "Current Name",
        "New Name": "New Name",
        "New Password": "New Password",
        "Login": "Login",
        "Please enter your login and password!": "Please enter your username and password!"
    }
}

String.prototype.localize = function(this: string) {
    const lang = Cookies.get("language") || "CZ"
    //@ts-ignore
    if (!languages[lang][this]) console.log(this)
    //@ts-ignore
    else return languages[lang][this]
    return this
}

export default {}