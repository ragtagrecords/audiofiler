export function logError(functionName: string, message: string) {
    console.log("ERROR: " + functionName + " | " + message);
}

export function logSuccess(functionName: string, message: string) {
    console.log('SUCCESS: ' + functionName + " | " + message);
}
