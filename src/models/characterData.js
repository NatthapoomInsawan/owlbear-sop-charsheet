
const characterData = {
    playerName: "",
    characterName: "",
    characterClass: "",
    characterSubclass: "",
    characterLineage: "",
    characterAmbition: "",

    might: 0,
    toughness: 0,
    agility: 0,
    willpower: 0,
    intelligence: 0,
    fate: 0,

    grit: 0,
    initiative: 0,
    luck: 0,
    armor: 0,

    weapons: [],
    skills: []
}

characterData.grit = characterData.toughness;
characterData.initiative = characterData.agility;
characterData.luck = characterData.fate;

export default characterData;

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

    characterData.weapons.push(weapon);
    return weapon;
}

export function removeWeapon(weaponIndex) {
    if (weaponIndex >= 0 && weaponIndex < characterData.weapons.length) {
        characterData.weapons.splice(weaponIndex, 1);
    }
}

export function addSkill(skillName, skillAttribute, skillRank) {
    const skill = {
        name: skillName,
        attribute: skillAttribute,
        rank: skillRank,
        value: skillRank + (Number(characterData[skillAttribute]) || 0)
    };
    characterData.skills.push(skill);
    return skill;
}

export function removeSkill(skillIndex) {
    if (skillIndex >= 0 && skillIndex < characterData.skills.length) {
        characterData.skills.splice(skillIndex, 1);
    }
}
