import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import TimerPage from "../views/TimerPage.vue";
import ResultPage from "../views/ResultPage.vue";

const accessTime = new Date("2025-05-02T15:00:00").getTime();

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", name: "TimerPage", component: TimerPage },
        { path: "/home", name : "HomePage" , component: HomePage },
        { path: "/result", name : "ResultPage" , component: ResultPage },
    ],
});

router.beforeEach((to, from, next) => {
    const now = new Date().getTime();
    if (now < accessTime && to.path === "/home") {
        next("/");
    } else {
        next();
    }
});

export default router;
