<template>
    <div class="bulb">
        <div><img style="margin-right: 15px" src="/src/assets/img/bulb.svg" alt="" /></div>
        <div class="line">
            <div style="color: #00796b">Are you an Acupuncturist/ TCM Practitioner/ Clinic Owner?</div>
            <div class="text">Aura Cure provides TCM-focused EMR and client-facing platform for you.</div>
        </div>
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
        display: flex;
        margin: 0px auto 20px;
        padding: 20px;
        // width: 90%;
        border-radius: 12px;
        background: linear-gradient(90deg, #e8fffc 0%, #e9ffd0 100%);
        .line {
            font-weight: 700;
            font-size: 22px;
        }
        .text {
            margin-top: 20px;
            color: #00796b;
            font-weight: 500;
            font-size: 20px;
        }
        .btn {
            margin: auto 0 auto auto;
            width: 280px;
            height: 40px;
        }
    }
</style>
