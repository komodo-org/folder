<template>
  <div class="floating-chat-container">
    <!-- Floating button -->
    <button
      class="chat-button"
      @click="toggleChat"
      :class="{ active: isChatOpen }"
    >
      <span v-if="!isChatOpen">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-message-circle"
        >
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
          />
        </svg>
      </span>
      <span v-else>&times;</span>
    </button>

    <!-- Chat window (conditionally rendered) -->
    <div v-if="isChatOpen" class="chat-window">
      <div class="chat-header">
        <h3>Chat Assistant</h3>
        <button class="close-button" @click="toggleChat">&times;</button>
      </div>

      <div class="chat-messages" ref="messagesContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.sender]"
        >
          <div class="message-content">{{ message.text }}</div>
        </div>
        <div v-if="isLoading" class="message bot">
          <div class="message-content loading">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <input
          type="text"
          v-model="userInput"
          placeholder="Type your message..."
          @keyup.enter="sendMessage"
        />
        <button @click="sendMessage" :disabled="!userInput.trim() || isLoading">
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { callOpenAI } from "../../services/openaiService";

export default {
  name: "FloatingChat",
  data() {
    return {
      isChatOpen: false,
      userInput: "",
      messages: [{ text: "Hello! How can I help you today?", sender: "bot" }],
      isLoading: false,
    };
  },
  watch: {
    // Auto-scroll to bottom when messages update
    messages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      deep: true,
    },
    // Auto-scroll when chat is opened
    isChatOpen(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
  },
  methods: {
    toggleChat() {
      this.isChatOpen = !this.isChatOpen;
    },
    scrollToBottom() {
      if (this.$refs.messagesContainer) {
        this.$refs.messagesContainer.scrollTop =
          this.$refs.messagesContainer.scrollHeight;
      }
    },
    async sendMessage() {
      if (!this.userInput.trim() || this.isLoading) return;

      const userMessage = this.userInput.trim();
      this.messages.push({ text: userMessage, sender: "user" });
      this.userInput = "";

      this.isLoading = true;

      try {
        const response = await callOpenAI(userMessage);
        // Add bot response to chat
        this.messages.push({ text: response, sender: "bot" });
      } catch (error) {
        console.error("Error calling OpenAI API:", error);
        this.messages.push({
          text: "Sorry, I encountered an error. Please try again.",
          sender: "bot",
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.floating-chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: Arial, sans-serif;
}

.chat-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #4a5568;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  padding: 0;
}

.chat-button:hover {
  background-color: #2d3748;
  transform: scale(1.05);
}

.chat-button.active {
  background-color: #e53e3e;
}

.chat-window {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 350px;
  height: 450px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background-color: #4a5568;
  color: white;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 16px;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 18px;
  margin-bottom: 5px;
  word-break: break-word;
}

.message.user {
  align-self: flex-end;
  background-color: #4299e1;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.bot {
  align-self: flex-start;
  background-color: #e2e8f0;
  color: #1a202c;
  border-bottom-left-radius: 4px;
}

.loading span {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #718096;
  border-radius: 50%;
  margin: 0 2px;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #e2e8f0;
}

.chat-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #cbd5e0;
  color: #1a202c;
  border-radius: 20px;
  margin-right: 8px;
  outline: none;
}

.chat-input button {
  padding: 8px 16px;
  background-color: #4a5568;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

.chat-input button:hover:not(:disabled) {
  background-color: #2d3748;
}

.chat-input button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}
</style>
