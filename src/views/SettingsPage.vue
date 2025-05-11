<template>
  <header class="navbar navbar-default">
    <nav class="container-fluid d-flex align-items-center justify-content-between">
      <div class="navbar-header d-flex align-items-center">
        <router-link to="/" class="navbar-brand">
          <img class="logo" src="../assets/ParaStructBeta_Logo_Text.webp" />
        </router-link>
      </div>

      <div class="settings-btn ms-auto">
        <router-link to="/settings" class="btn btn-outline-light no-border">
          <font-awesome-icon icon="cog"/>
        </router-link>
      </div>
    </nav>
  </header>

  <div class="settings-container">
    <div class="settings-section">
      <h1 class="settings-title">Local Pricing</h1>
      <div class="settings-body">
        <ul class="settings-body-content">
          <li
            v-for="item in localPrices"
            :key="item.id"
            class="settings-list-item"
            :id="item.id"
          >
            <div class="row">
              <div class="col">
                <span class="settings-item-title">{{ item.name }}</span>
              </div>
              <div class="col">
                {{ item.price }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const localPrices = [
  { id: 'REBAR', name: 'Rebar', price: '$1.00 per ft.' },
  { id: 'CONCRETE', name: 'Concrete', price: '$0.72 per pound' },
  { id: 'WOOD', name: 'Wood', price: '$0.92 per ft.' },
  { id: 'GRAVEL', name: 'Gravel', price: '$1.02 per cu. ft.' },
  { id: 'SEALER', name: 'Sealer', price: '$15.00 per gallon' }
];
</script>