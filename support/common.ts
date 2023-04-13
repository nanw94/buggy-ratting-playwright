import { faker } from '@faker-js/faker';
import { expect } from '@playwright/test';

const requestURL = 'https://k51qryqov3.execute-api.ap-southeast-2.amazonaws.com/prod';

export function createUser() {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const userName = faker.internet.userName();
    const password = faker.internet.password()+'1'+'!';
    const comment = faker.random.words();
    return {
        firstName,
        lastName,
        userName,
        password,
        comment,
    }
}

export async function getToken(username: string, password: string):Promise<string>{
    const url = `${requestURL}/oauth/token`;
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("username", username);
    params.append("password", password);  
    const response = await fetch(url, {
      method: "POST",
      body: params
    });
    const data = await response.json();
    return data.access_token;
}

export async function signUp(user) {
    const url = `${requestURL}/users`;
    const body = {username:user.userName,firstName:user.firstName,lastName:user.lastName,password:user.password,confirmPassword:user.password};
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
      });
    expect(response.ok); 
}

export async function getModels() {
    const url = `${requestURL}/models`;
    const response = await fetch(url);
    const data = await response.json();
    return data.models;
}

export async function getRandomModelId() {
    const index = Math.floor(Math.random() * (4) + 1);
    const models = await getModels();
    const modelId = models[index].id.replace("|", "%7C");
    return modelId;
}

export async function vote(user, model, comment) {
    const token = await getToken(user.userName, user.password);
    const body = {
        comment: comment,
    };
    const resp = await fetch(`${requestURL}/models/${model}/vote`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),

    });
    return resp;
}

export async function getModelVoteCount(modelId) {
    const resp = await fetch(`${requestURL}/models/${modelId}`);
    const data = await resp.json();
    return data.votes;    
}