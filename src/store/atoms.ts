import { atom } from 'jotai';

const defaultAtomValue = {
    inStorageValue: 0,
    balance: 0,
    boostValue: [
        {
            type: 0,
            label: 'Farm Speed',
            level: 3,
        },
        {
            type: 1,
            label: 'Boat',
            level: 2,
        },
        {
            type: 2,
            label: 'House',
            level: 2,
        }
    ]
}


export const systemState = atom(defaultAtomValue);