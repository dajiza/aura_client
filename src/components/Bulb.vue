<template>
    <div class="bulb">
        <div class="line">
            <img style="margin-right: 6px" src="/src/assets/img/bulb.svg" alt="" />
            <div style="color: #00796b">Are you an Acupuncturist/ TCM Practitioner/ Clinic Owner?</div>
        </div>
        <div class="text">Aura Cure provides TCM-focused EMR and client-facing platform for you.</div>
        <a-button class="btn" type="primary" @click="goto">Get listed & Try EMR for FREE</a-button>
    </div>
</template>

<script setup lang="ts">
    const goto = () => {
        window.open('https://aura-cure.com');
    };
</script>

<style lang="scss" scoped>
    .bulb {
        background: linear-gradient(90deg, #e8fffc 0%, #e9ffd0 100%);
        border-radius: 12px;
        padding: 20px;
        .line {
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: 700;
        }
        .text {
            font-size: 14px;
            font-weight: 500;
            color: #00796b;
            margin-top: 10px;
        }
        .btn {
            width: 100%;
            margin-top: 20px;
            height: 40px;
        }
    }
</style>
