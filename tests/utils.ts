import shortid from 'shortid'
import mutateCircles from '../api/mutate'
import { User, Post, Channel, UserChannel } from '../types/circles.'


const emailDomain = "@nowhere.com"

export type OperatingUser = {
    user: User,
    channels: Channel[],
    userChannels: UserChannel[],
    posts: Post[]
}

export async function createTestUsers(numberToCreate): Promise<User[]> {
    const userPromises = []
    const prefix = shortid.generate()
    for (let i = 1; i <= numberToCreate; i++) {
        userPromises.push(mutateCircles.createUser(createUserInput(`${prefix}-user${i}`)))
    }
    return await Promise.all(userPromises);
}

export async function destroyTestUsers(users: User[]) {
    const destroyPromises = []
    users.forEach((user) => {
        destroyPromises.push(mutateCircles.deleteUser({ userName: user.id }))
    })
    return await Promise.all(destroyPromises)
}
export function createUserInput(user) {
    return {
        email: `${user}${emailDomain}`,
        name: `${user}`,
        id: `${user}`,
        shareDos: false
    }
}
