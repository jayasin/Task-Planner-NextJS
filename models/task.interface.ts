export interface Task {
    task_name: string,
    created_at: string,
    from: string,
    to: string,
    modified_at: string,
    id: string
}

export interface IAddTask {
    task_name: string,
    from: string,
    to: string,
    id?: string
}
