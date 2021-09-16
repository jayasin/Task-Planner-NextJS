import * as toaster from 'toastr'
const BASE_URL = "https://us-central1-nextjs-test-8ba85.cloudfunctions.net"


export const API = {
    GET_TASK_LIST: `${BASE_URL}/list`, 
    SAVE_TASK: `${BASE_URL}/save`,
    DELETE_TASK: `${BASE_URL}/deleteTask`,
    UPDATE_TASK: `${BASE_URL}/modifyTask`
}

export const showNotification = (isSuccess: boolean, message: string): void => {
    const toasterOptions = { positionClass: 'toast-bottom-right' }
  
    if (isSuccess) {
      toaster.success(message, '', toasterOptions)
    } else {
      toaster.error(message, '', toasterOptions)
    }
  }