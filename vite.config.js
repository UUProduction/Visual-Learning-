import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        login: 'login.html',
        studentHome: 'student-home.html',
        teacherHome: 'teacher-home.html',
        game: 'game-vl.html'
      }
    }
  }
})
