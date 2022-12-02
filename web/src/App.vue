<template>
  <div class="md:container md:mx-auto h-[100vh]">
    <div class="h-2/3 w-full flex">
      <div class="flex-1 p-4">
        <div v-for="(item, index) in msgList" :key="index">
          <template v-if="item.socketId !== socketId">
            <span>{{ item.name }}: </span>
            {{ item.msg }}
          </template>
          <template v-else>
            <span class="text-right block">
              {{ item.msg }}
              &nbsp;我
            </span>
          </template>
        </div>
      </div>
      <div class="memebers w-[200px] border-l border-gray-200 p-2">
        <span class="block">成员: </span>
        <span
          class="block"
          v-for="m in memberList"
          :key="m.id"
          :class="{ 'text-green-500': m.id === socketId }"
          >{{ m.name }}</span
        >
      </div>
    </div>
    <div class="h-1/3 w-full pb-12 relative">
      <textarea
        v-model="text"
        type="text"
        class="w-full h-full p-4 border-t-gray-200 border"
      />
      <button
        class="right-0 absolute bottom-2 border border-gray-200 px-4 py-1 rounded"
        @click="handleSend"
      >
        发送
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { io } from "socket.io-client";
import { onMounted, ref } from "vue";
import { MemberItem, MsgItem } from "./types";

const text = ref<string>("");
const msgList = ref<MsgItem[]>([]);
const memberList = ref<MemberItem[]>([]);
const socketId = ref<string>("");

const curName = ref<string>("");

const socket = io("http://localhost:6969");

function handleSend() {
  socket.emit("message", text.value);
  msgList.value.push({
    socketId: socketId.value,
    msg: text.value,
    name: curName.value,
    byMe: true,
  });
  text.value = "";
}

socket.on("connect", () => {
  socketId.value = socket.id;
});

socket.on("connected", ({ name, memberList: list }) => {
  curName.value = name;
  memberList.value = list;
});

socket.on("message", (msg: MsgItem) => {
  msgList.value.push(msg);
});

socket.on("leave", (id) => {
  const index = memberList.value.findIndex((item) => item.id === id);
  if (index === -1) return;
  memberList.value.splice(index, 1);
});

socket.on("enter", (member) => {
  memberList.value.push(member);
});
</script>

<style scoped></style>
