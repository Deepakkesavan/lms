import {
  ApprovalStatusKey,
  GenderTypeKey,
  IReusableDictionary,
  LeaveDayType,
  LeaveTypeKey,
} from '../literal-types/literal-types';
import { ICatalog } from './common';

export interface IInfoCard {}

export interface ICatalogResponse {
  catalogs: IReusableDictionary<
    LeaveDayType | LeaveTypeKey | GenderTypeKey | ApprovalStatusKey,
    ICatalog[]
  >;
}
