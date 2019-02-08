
export const themeCode = (assessment) => {
    let code = null;
    switch (assessment) {
        case 'Wholesomeness':
            code = 'WSMN';
            break;
        case 'Diet Score':
            code = 'DAN';
            break;
        case 'Thought Control':
            code = 'TAC';
            break;
        case 'Zest For Life':
            code = 'ZFL';
            break;
        case 'Strength & Energy':
            code = 'SAE';
            break;
        case 'Relationship & Intimacy':
            code = 'RAI';
            break;
        case 'Biological Age':
            code = 'BLA';
            break;
    }
    return code;
}