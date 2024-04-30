import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Word } from "./Word";
import { UserWord } from "./UserWord";

@Entity()
export class Challenge {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ name: 'created_at' })
    createdAt!: Date

    @Column({ name: 'updated_at' })
    updatedAt!: Date

    //Challenge > Words
    @OneToMany(() => Word, (word) => word.challenge)
    words!: Word[];

}