import { getStudentId, getToken } from "@/utils/CookieManager";
import { queryParamBuilder } from "@/utils/Helpers";
import axios from "axios";

export const clientUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
export const serverUrl = process.env.BACKEND_URL;

export const sendOtp = async (body, recaptcha) => {
  const response = await axios.post(`${clientUrl}/users/sendOtp`, body, {
    headers: {
      recaptcha,
      "ngrok-skip-browser-warning": "any",
    },
  });
  return response;
};

export const verifyOtp = async (body, recaptcha) => {
  const response = await axios.post(`${clientUrl}/users/login`, body, {
    headers: {
      recaptcha,
      "ngrok-skip-browser-warning": "any",
    },
  });
  return response;
};

export const fetchUserData = async () => {
  const response = await axios.get(`${clientUrl}/users/me`, {
    headers: {
      Authorization: getToken(),
      "ngrok-skip-browser-warning": "any",
    },
  });

  return response;
};

export const fetchStudentNotifications = async (query) => {
  let data = queryParamBuilder(query);
  const response = await axios.get(
    `${clientUrl}/notice/my-notifications?${data}`,
    {
      headers: {
        Authorization: getToken(),
        "ngrok-skip-browser-warning": "any",
        "x-student-id": getStudentId(),
      },
    }
  );

  return response;
};

export const updateSettings = async (body) => {
  const response = await axios.post(
    `${clientUrl}/users/settings`,
    body,
    {
      headers: {
        Authorization: getToken(),
        "ngrok-skip-browser-warning": "any",
        "x-student-id": getStudentId(),
      },

    }
  );

  return response;
}


export const acknowledgeNotification = async (id) => {
  const response = await axios.post(
    `${clientUrl}/notice/acknowledge/${id}`, {},
    {
      headers: {
        Authorization: getToken(),
        "ngrok-skip-browser-warning": "any",
        "x-student-id": getStudentId(),
      },

    }
  );

  return response;
}

export const fetchQuestions = async (page) => {
  const response = await axios.get(
    `${clientUrl}/questions/my`,
    {
      headers: {
        Authorization: getToken(),
        "ngrok-skip-browser-warning": "any",
        "x-student-id": getStudentId(),
      },
    }
  );

  return response;
};

export const createQuestion = async (body) => {
  const response = await axios.post(
    `${clientUrl}/questions/create`,
    body,
    {
      headers: {
        Authorization: getToken(),
        "ngrok-skip-browser-warning": "any",
        "x-student-id": getStudentId(),
      },
    }
  )
  return response;
}

export const humanIntervention = async (id) => {
  const response = await axios.post(
    `${clientUrl}/questions/human-intervention/${id}`, {},
    {
      headers: {
        Authorization: getToken(),
        "ngrok-skip-browser-warning": "any",
        "x-student-id": getStudentId(),
      },
    }
  )
  return response;
}