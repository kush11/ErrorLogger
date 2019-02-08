const calculateBmi = (height, weight) => {
    let newHeight = height / 100;
    let result = weight / (newHeight * newHeight);
    let bmi = '';
    if (isFinite(result))
        bmi = result.toFixed(2);
    return bmi;
}
export default calculateBmi;