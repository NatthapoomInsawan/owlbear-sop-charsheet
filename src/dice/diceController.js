import { initDiceTray, clearDice, addDiceToTray } from '/src/dice/diceTray';

import OBR from "@owlbear-rodeo/sdk";

/**
 * Rolls a pool of D6 dice and returns the array of results
 * @param {number} count Number of D6 to roll
 * @returns {Promise<number[]>} Array of face values
 */
export async function rollD6Pool(count) {
    await OBR.modal.open({
        id: "roll-popover",
        url: `/src/dice/diceCanvas.html?diceCount=${count}`,
        fullScreen: true,
        hideBackdrop: true,
        hidePaper: true,
        disablePointerEvents: true,
    });
}

export async function simulateDiceRoll(diceCount){

    await initDiceTray();

    // Clear previous roll if exists
    clearDice();
    let activeDice = [];

    // Make canvas container visible and grab pointer events if we want interaction
    const container = document.getElementById('dice-canvas-container');

    if (container) {
        container.style.opacity = '1';
        // container.style.pointerEvents = 'auto'; // if you want users to click dice
    }

    // Spawn and throw requested amount of dice
    for (let i = 0; i < diceCount ; i++) {
        const dice = addDiceToTray();
        if (dice) {
            dice.throw();
            activeDice.push(dice);
        }
    }

    // Create a promise that resolves when all dice stop moving
    const currentRollPromise = new Promise((resolve) => {
        const checkAsleep = setInterval(() => {
            let allAsleep = true;
            for (const dice of activeDice) {
                if (!dice.isAsleep()) {
                    allAsleep = false;
                    break;
                }
            }

            if (allAsleep) {
                clearInterval(checkAsleep);
                
                // Read faces
                const results = activeDice.map(d => d.getTopFace());
                resolve(results);
            }
        }, 100);
    });

    const finalResults = await currentRollPromise;
    // Optional: Hide tray automatically after a delay or wait for user to click away
    setTimeout(() => {
        if (container) {
            container.style.opacity = '0';
        }

        OBR.modal.close("roll-popover");
    }, 3000); // fade out after 3s

    return finalResults;
}