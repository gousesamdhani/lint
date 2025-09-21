
export function mock<T extends (...args: any) => any>(
    implementation?: (...args: Parameters<T>) => ReturnType<T>
): jest.Mock<ReturnType<T>, Parameters<T>> {
    return jest.fn<ReturnType<T>, Parameters<T>>(implementation);
}