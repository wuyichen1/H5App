import aiClient from './aiClient'

// AI聊天
export function aiChat(message) {
  return aiClient.post('/opi/v1/yVZSfGAs', {
    system:
      'You are Tati—an AI companion dedicated to bringing you all sorts of fun and interesting things.',
    dashScopeMessageDTOList: [
      {
        role: 'user',
        content: message,
      },
    ],
  })
}
