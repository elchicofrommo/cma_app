
import { Auth, } from "aws-amplify";
import mutateApi, { CreateUserInput, } from '../api/mutate'
import apiGateway from '../api/apiGateway'
import { store } from '../redux/store'
import { User, Channel, ChannelMember, Post, Broadcast, } from '../types/circles.'
import log from "./Logging"
import queryApi from '../api/query'

export type UserDetailResult = {

    operatingUser?: User,
    broadcastMap?: Map<string, Broadcast[]>,
    error?: string,

}

export enum Role {
    GUEST, BASIC, PAID, ADMIN, MEETING
}

export type AuthorizeResult = {
    userName?: string,
    role?: Role,
    email?: string,
    error?: string
}
export async function authorize(): Promise<AuthorizeResult> {
    // if we are here then successful, get user data from cloud
    const currentCredentials = await Auth.currentCredentials()
    log.verbose(
        'got current creds', {currentCredentials}
    )
    try{
        const currentUser = await Auth.currentAuthenticatedUser();
        log.verbose(
            'got current user', {currentUser}
        )
        let role = Role.BASIC;
        const groups: [] = currentUser.signInUserSession.accessToken.payload['cognito:groups'];
        if(groups.includes('admin'))
            role = Role.ADMIN;
        return { userName: currentUser.username, email: currentUser.attributes.email, role }
    }catch(authError){
        return{error: authError, role: Role.GUEST}
    }

    
    
}
export async function signUp(email: string, password: string, name: string): Promise<{ error?: string }> {
    try {
        log.verbose(`logging in  `, { email, password, name });
        const signup = await Auth.signUp(email, password);
        log.verbose(`sign up response `, { signup });

        if (signup.userConfirmed) {
            try {
                const result = await signIn(email, password)
                if (result.error) {
                    log.error(`error signing in after cognito account created, somethign is seriously wrong`, { error: result.error })
                    return { error: "A system problem occured while creating your account. Contact admin for help." }
                }

                const userInput: CreateUserInput = {
                    email,
                    name, 
                    id: result.userName
                }

                await mutateApi.createUser(userInput)
                const userDetails = await getUserDetails(userInput.id)

                if (result.error) {
                    return { error: result.error };
                } else {
                    return;
                }
            } catch (createUserError) {
                log.error(`problem creating user, probably just duplicate`, { createUserError })
                return { error: createUserError }
            }
        }
    } catch (err2) {
        log.verbose(`sign up error `, { signUpErr: err2 });
        if (err2.code == "UsernameExistsException")
            return {error: "A Similar account exists already. If you have forgotten your password contact administrator to reset."}

        else
            return {error: JSON.stringify(err2)}
    }
}


export async function signOut() {
    const result = Auth.signOut();
    const currentCredentials = await Auth.currentCredentials();
    log.verbose(`current credentials`, { currentCredentials })
    store.dispatch({ type: "SIGN_OUT" });
}



export async function signIn(email: string, password: string): Promise<AuthorizeResult> {
    log.info(
        `signing in with email: ${email} password: ${password}`
    );

    if (!email || !password) {

        return { email, error: "Fields not complete" };
    }
    let pattern = new RegExp(/\S+?@\S+?\.\S+/);
    if (!pattern.exec(email)) {

        return { email, error: "Email address is not valid format" };
    }

    try {
        const result = await Auth.signIn(email.trim(), password,);
        log.verbose(`auth done`, { authResults: result })
        // now pull out jwtToken and refresh token
        const userName = result.username;

        store.dispatch({ type: "SET_AUTH_TOKENS", tokens: { email, password} })
        return { userName, email,  }
    } catch (err) {
        log.verbose("error in authentication", { error: err })
        return { email, error: err.message ? err.message : err }
    }
}

export async function getUserDetails(id: string): Promise<UserDetailResult> {

    try {

        const user = await queryApi.fetchUser(id)
        log.info(`successful retrevial of operating user `);

        const broadcastsByChannel = await queryApi.fetchBroadcastPost(user);
        log.info(`broadcastByChannel`, { broadcastsByChannel })
        const userResult = {
            operatingUser: user,
            broadcastsByChannel,
        }

        store.dispatch({ type: "SAVE_AUTH", data: userResult });

        const meetingDetails = await apiGateway.getMeetingDetails(user)
        store.dispatch({ type: 'SYNC_MEETINGS', data: meetingDetails })

        return userResult
    } catch (err) {
        log.info(`caught error signing in`, { err })
        return { error: err.message }

    }
}