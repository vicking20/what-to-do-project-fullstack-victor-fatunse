import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    CreatedAt,
    UpdatedAt, 
    AllowNull,
    ForeignKey,
    BelongsTo,
  } from "sequelize-typescript";
  import { ActivityModel } from "./activityModel";
  
  export enum TaskStatusEnum {
    New = 0,
    InProgress = 1,
    Done = 2
  }

  @Table({ tableName: "Tasks", timestamps: true })
  export class TaskModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    taskId!: number;
  
    @Column({ type: DataType.STRING, allowNull: false })
    name!: string;
  
    @Column({ type: DataType.STRING, allowNull: false })
    content!: string;
  
    @Column({ type: DataType.DATE, allowNull: true })
    startDate?: Date;
  
    @Column({ type: DataType.DATE, allowNull: true })
    endDate?: Date;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: TaskStatusEnum.New,
      validate: {
        isIn: {
          args: [[TaskStatusEnum.New, TaskStatusEnum.InProgress, TaskStatusEnum.Done]],
          msg: "Status must be one of New, InProgress, or Done"
        },
      },
     })
     status!: TaskStatusEnum;
  
    @CreatedAt
    @Column({ type: DataType.DATE })
    createdAt!: Date;
  
    @UpdatedAt
    @Column({ type: DataType.DATE })
    updatedAt!: Date;

    @ForeignKey(() => ActivityModel)
    @Column({ type: DataType.INTEGER, allowNull: true })
    activityId!: number | null;

    @BelongsTo(() => ActivityModel)
    activity!: ActivityModel;
  }
  