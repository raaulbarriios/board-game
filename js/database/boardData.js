export const BOARD_SIZE = 63;

export const BOARD_DATA = Array.from({ length: BOARD_SIZE }, (_, i) => {
    const spaceIndex = i + 1;
    return {
        index: spaceIndex,
        type: 'normal',
        name: `Casilla ${spaceIndex}`,
        actionMessage: null,
        targetSpace: null,
        skipTurns: 0
    };
});

function configSpace(index, type, name, msg, target = null, skips = 0) {
    if (index < 1 || index > BOARD_SIZE) return;
    const space = BOARD_DATA[index - 1];
    space.type = type;
    space.name = name;
    if (msg) space.actionMessage = msg;
    if (target) space.targetSpace = target;
    if (skips) space.skipTurns = skips;
}

const ocas = [5, 9, 14, 18, 23, 27, 32, 36, 41, 45, 50, 54, 59, 63];
for (let i = 0; i < ocas.length - 1; i++) {
    configSpace(ocas[i], 'oca', 'Oca', '¡De oca a oca y tiro porque me toca!', ocas[i + 1]);
}

configSpace(6, 'puente', 'Puente', '¡De puente a puente y tiro porque me lleva la corriente!', 12);
configSpace(12, 'puente', 'Puente', '¡De puente a puente, tiro y cruzo la corriente!', 19);

configSpace(19, 'posada', 'Posada', '¡A descansar a la posada! Pierdes 2 turnos.', null, 2);

configSpace(31, 'pozo', 'Pozo', '¡Oh no, al pozo! Pierdes 3 turnos.', null, 3);

configSpace(42, 'laberinto', 'Laberinto', 'Te has perdido en el laberinto. Vuelve a la casilla 30.', 30);

configSpace(52, 'carcel', 'Cárcel', '¡Vas directo a la cárcel! Pierdes 3 turnos.', null, 3);

configSpace(58, 'calavera', 'Calavera', '¡La Muerte! Vuelves a la casilla 1.', 1);

configSpace(63, 'meta', 'Jardín de la Oca', '¡Felicidades, has llegado al final!', null);

export function getSpaceData(index) {
    if (index < 1 || index > BOARD_SIZE) return null;
    return BOARD_DATA[index - 1];
}
