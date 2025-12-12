import { useResetRecoilState, useSetRecoilState } from "recoil";
import { authAtom, messageAtom, roomsAtom, userProfileAtom } from "../store/chatAppAtom";

export function useResetData() {
    const setAuth = useSetRecoilState(authAtom)
    const resetRooms = useResetRecoilState(roomsAtom)
    const resetMessages = useResetRecoilState(messageAtom)
    const resetProfile = useResetRecoilState(userProfileAtom)

    const handleLogout = () => {

        //clearing data from local storage and recoil state
        localStorage.clear();

        resetRooms();
        resetProfile();
        resetMessages()

        setAuth({
            isLoggedIn: false,
            isChecked: true,
            user: null
        })

    }

    return handleLogout;
}