import axios from "axios";

class ApiService {

  static apiBase = "http://localhost:5000";

  static async login(userData) {
    const res = await axios.post(ApiService.apiBase + '/login', userData);
    const { token } = res.data;
    localStorage.setItem("token", token);
    return true;
  }

  static async getContacts(user_id) {
    const token = localStorage.getItem("token");
    const contacts = await axios.get(`${ApiService.apiBase}/contacts?user_id=${user_id}`,
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
    return contacts.data;
  }

  static async userInfo() {
    const token = localStorage.getItem("token");
    const user = await axios.get(`${ApiService.apiBase}/me`,
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
    return user.data;
  }

  static async addContact(
    {
      name, phoneNumber
    }
  ) {
    const token = localStorage.getItem("token");
    await axios.post(`${ApiService.apiBase}/add`,
      {
        contact: {
          id: 5,
          name: name,
          phoneNumber: phoneNumber,
          user_id: 0
        }
      },
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      },
    )
  }

  static async deleteContact({ contactId }) {
    const resp = await axios.delete(`${ApiService.apiBase}/delete`,
      {
        data: {
          contactId: contactId
        }
      }
    )
    return resp.data;
  }
}

export default ApiService;