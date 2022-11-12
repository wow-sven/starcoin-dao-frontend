import { IDAO } from '../extpoints/dao_app';
import { executeTokenAcceptProposal } from '../utils/stakeSBTPluginAPI';

class UpgradeProposalAction {
  dao: IDAO;
  name: string;

  constructor(dao: IDAO) {
    this.dao = dao;
    this.name = '0x1::UpgradeModulePlugin::UpgradeProposalAction';
  }

  async execute(params: any) {
    // return executeTokenAcceptProposal(params.proposalId)
  }
}

export default UpgradeProposalAction;