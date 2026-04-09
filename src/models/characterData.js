
let playerName = ""

let characterName = "";
let characterClass = "";
let characterSubclass = "";
let characterLineage = "";
let characterAmbition = "";

let might = 0;
let toughness = 0;
let agility = 0;
let willpower = 0;
let intelligence = 0;
let fate = 0;

let grit = toughness;
let initiative = agility;
let luck = fate;
let armor = 0;

let weapons = [];

export default { 
    playerName: playerName,
    characterName: characterName,
    characterClass: characterClass,
    characterSubclass: characterSubclass,
    characterLineage: characterLineage,
    characterAmbition: characterAmbition,
    
    might: might,
    toughness: toughness,
    agility: agility,
    willpower: willpower,
    intelligence: intelligence,
    fate: fate,

    grit: grit,
    initiative: initiative,
    luck: luck,
    armor: armor,

    weapons: weapons
};

export function getDerivedStats(attributeName) {
    const derivationStatKvp = {
        toughness: ["grit"],
        agility: ["initiative"],
        fate: ["luck"],
    };

    return derivationStatKvp[attributeName] || [];
}

export function addWeapon(weaponName, weaponRange, weaponDamage, weaponTraits) {
    const weapon = {
        name: weaponName,
        range: weaponRange,
        damage: weaponDamage,
        traits: weaponTraits
    };

    weapons.push(weapon);
    return weapon;
}

export function removeWeapon(weaponIndex) {
    if (weaponIndex >= 0 && weaponIndex < weapons.length) {
        weapons.splice(weaponIndex, 1);
    }
}
