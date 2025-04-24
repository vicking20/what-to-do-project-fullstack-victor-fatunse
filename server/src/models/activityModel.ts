import sequelize from "sequelize";
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    CreatedAt,
    UpdatedAt,
    HasMany,
    AllowNull,
    BeforeDestroy
} from "sequelize-typescript";
import { TaskModel } from "./taskModel";

@Table({ tableName: "Activities", timestamps: true })
export class ActivityModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    activityId!: number;

    @Column({ type: DataType.STRING, allowNull: false })
    name!: string;

    @Column({ type: DataType.STRING, allowNull: true })
    description?: string;

    @CreatedAt
    @Column({ type: DataType.DATE })
    createdAt!: Date;

    @UpdatedAt
    @Column({ type: DataType.DATE })
    updatedAt!: Date;

    @HasMany(() => TaskModel)
    tasks!: TaskModel[];

    @BeforeDestroy
    static async setActivityIdToNull(activity: ActivityModel) {
        await TaskModel.update({ activityId: null }, { where: { activityId: activity.activityId } });
    }
}