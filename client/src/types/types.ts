//types.ts
export interface taskStatus {
  value: 0 | 1 | 2;
}

export interface TaskOptionsProps {
    task: TaskModel;
    onDelete: () => void;
    onEdit: (task: TaskModel) => void;
}

export interface ActivityOptionsProps {
    activity: ActivityModel;
    onDelete: () => void;
    onEdit: (activityId: ActivityModel) => void;
}

export interface ActivityModel {
    activityId: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export enum TaskStatusEnum {
New = 0,
InProgress = 1,
Done = 2,
}

export interface TaskModel {
    taskId: number | string;      
    name: string;        
    content: string;     
    startDate: string;  
    endDate: string;
    status: TaskStatusEnum;    
    createdAt: string;   
    updatedAt: string;
    activityId: number | null;   
}

export interface NewActivityModalProps {
    onActivityCreated: () => void;
}

export interface TaskEditModalProps {
    task: TaskModel;
    onTaskUpdated: () => void;
}
