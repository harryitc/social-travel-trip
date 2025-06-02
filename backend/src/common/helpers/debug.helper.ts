export class DebugHelper {
  private static startTime: number;
  private static operationName: string;

  static startTimer(operationName: string) {
    DebugHelper.operationName = operationName;
    DebugHelper.startTime = Date.now();
  }

  static endTimer() {
    const endTime = Date.now();
    const duration = endTime - DebugHelper.startTime;
    console.log(
      `Operation "${DebugHelper.operationName}" Duration: ${duration}ms`,
    );
  }
}
