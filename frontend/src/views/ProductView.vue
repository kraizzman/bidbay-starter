<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "../store/auth";

const { isAuthenticated, isAdmin, userData, token } = useAuthStore();

const error = ref(false);
const loading = ref(false);
const product = ref();

const route = useRoute();
const router = useRouter();

const productId = ref(route.params.productId);

function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("fr-FR", options);
}

async function fetchProduct() {
  loading.value = true;
  error.value = false;

  try {
    const res = await fetch('http://localhost:3000/api/products/' + productId.value);
    product.value = await res.json();
    console.log(product.value)

    product.value.bids.sort((a, b) => {
      if (a.price < b.price) {
        return 1;
      } else if (a.price > b.price) {
        return -1;
      } else {
        return 0;
      }
    })

    if (!res.ok) {
      throw new Error('Une erreur est survenue lors du chargement du produit.');
    }
  } catch (e) {
    error.value = true;
    console.log(e)
  } finally {
    loading.value = false;
  }
}

const currentProduct = computed(() => {
  let currentProduct = product.value

  return currentProduct;
})

fetchProduct();
</script>

<template>
  <div class="row">
    <div class="text-center mt-4" data-test-loading v-if="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div class="alert alert-danger mt-4" role="alert" data-test-error v-if="error">
      Une erreur est survenue lors du chargement des produits.
    </div>
    <div class="row" data-test-product v-if="!error">
      <!-- Colonne de gauche : image et compte à rebours -->
      <div class="col-lg-4">

        <img :src="currentProduct.pictureUrl" class="img-fluid rounded mb-3" data-test-product-picture />
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">Compte à rebours</h5>
          </div>
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-muted" data-test-countdown>
              Temps restant : 5h 30min 15s
            </h6>
          </div>
        </div>
      </div>
      <!-- Colonne de droite : informations du produit et formulaire d'enchère -->
      <div class="col-lg-8">
        <div class="row">
          <div class="col-lg-6">
            <h1 class="mb-3" data-test-product-name>
              {{ currentProduct.name }}
            </h1>
          </div>
          <div class="col-lg-6 text-end">
            <RouterLink
              :to="{ name: 'ProductEdition', params: { productId: (currentProduct.id) ? currentProduct.id : 0 } }"
              class="btn btn-primary" data-test-edit-product>
              Editer
            </RouterLink>
            &nbsp;
            <button class="btn btn-danger" data-test-delete-product>
              Supprimer
            </button>
          </div>
        </div>

        <h2 class="mb-3">Description</h2>
        <p data-test-product-description>
          {{ currentProduct.description }}
        </p>

        <h2 class="mb-3">Informations sur l'enchère</h2>
        <ul>
          <li data-test-product-price>Prix de départ : {{ currentProduct.originalPrice }} €</li>
          <li data-test-product-price>Prix actuel : {{ (currentProduct.bids && currentProduct.bids.length > 0) ?
            currentProduct.bids[0].price :
            currentProduct.originalPrice }} €
          </li>
          <li data-test-product-end-date>Date de fin : {{ formatDate(currentProduct.endDate) }}</li>
          <li>
            Vendeur :
            <router-link
              :to="{ name: 'User', params: { userId: (currentProduct.sellerId) ? (currentProduct.sellerId) : 0 } }"
              data-test-product-seller>
              {{ (currentProduct.seller) ? currentProduct.seller.username : "Anonyme" }}
            </router-link>
          </li>
        </ul>

        <h2 class="mb-3">Offres sur le produit</h2>
        <table class="table table-striped" data-test-bids>
          <thead>
            <tr>
              <th scope="col">Enchérisseur</th>
              <th scope="col">Offre</th>
              <th scope="col">Date</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 10" :key="i" data-test-bid>
              <td>
                <router-link :to="{ name: 'User', params: { userId: 'TODO' } }" data-test-bid-bidder>
                  charly
                </router-link>
              </td>
              <td data-test-bid-price>43 €</td>
              <td data-test-bid-date>22 mars 2026</td>
              <td>
                <button class="btn btn-danger btn-sm" data-test-delete-bid>
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p data-test-no-bids>Aucune offre pour le moment</p>

        <form data-test-bid-form>
          <div class="form-group">
            <label for="bidAmount">Votre offre :</label>
            <input type="number" class="form-control" id="bidAmount" data-test-bid-form-price />
            <small class="form-text text-muted">
              Le montant doit être supérieur à 10 €.
            </small>
          </div>
          <button type="submit" class="btn btn-primary" disabled data-test-submit-bid>
            Enchérir
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
