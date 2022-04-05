import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  // eslint-disable-next-line prettier/prettier
  Resolver
} from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { AuthUser, currentUser } from 'src/http/auth/current-user';
import { CustomersService } from 'src/services/customers.service';
import { ProductsService } from 'src/services/products.service';
import { PurchasesService } from 'src/services/purchases.service';
import { CreatePurchaseInput } from '../inputs/create-purchase-input';
import { Purchase } from '../models/purchase';

@Resolver(() => Purchase)
export class PurchaseResolver {
  constructor(
    private purchasesService: PurchasesService,
    private productsService: ProductsService,
    private customersService: CustomersService,
  ) {}

  @Query(() => [Purchase])
  @UseGuards(AuthorizationGuard)
  purchases() {
    return this.purchasesService.listAllPurchases();
  }

  @ResolveField()
  product(@Parent() purchase: Purchase) {
    return this.productsService.getProductById(purchase.productId);
  }

  @Mutation(() => Purchase)
  @UseGuards(AuthorizationGuard)
  async createProduct(
    @Args('data') data: CreatePurchaseInput,
    @currentUser() user: AuthUser,
  ) {
    let customer = await this.customersService.getCustomerByUserId(user.sub);

    if (!customer) {
      customer = await this.customersService.createCustomer({
        authUserId: user.sub,
      });
    }

    return this.purchasesService.createPurchase({
      productId: data.productId,
      customerId: customer.id,
    });
  }
}
